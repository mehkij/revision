package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/mehkij/revision/internal/database"
)

type Comment struct {
	ID        string `json:"id"`
	Author    string `json:"author"`
	Body      string `json:"body"`
	Date      string `json:"date"`
	FilePath  string `json:"filepath"`
	Repo      string `json:"repo"`
	Resolved  bool   `json:"resolved"`
	AvatarURL string `json:"avatar_url"`
}

func (cfg *apiConfig) createCommentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	type parameters struct {
		StartLinePos int    `json:"startLinePos"`
		StartCharPos int    `json:"startCharPos"`
		EndLinePos   int    `json:"endLinePos"`
		EndCharPos   int    `json:"endCharPos"`
		Text         string `json:"text"`
		Repo         string `json:"repo"`
		CommitHash   string `json:"commitHash"`
		Author       string `json:"author"`
		FilePath     string `json:"filePath"`
		GitHubID     int64  `json:"githubId"`
		Avatar       string `json:"avatar_url"`
		GithubToken  string `json:"githubToken"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't decode response body: %s", err))
		return
	}

	user, err := cfg.queries.UpsertUser(r.Context(), database.UpsertUserParams{
		GithubID:    params.GitHubID,
		Username:    params.Author,
		Avatar:      params.Avatar,
		GithubToken: sql.NullString{String: params.GithubToken, Valid: params.GithubToken != ""},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't upsert user: %s", err))
		return
	}

	createdComment, err := cfg.queries.CreateComment(r.Context(), database.CreateCommentParams{
		LineStart:  int32(params.StartLinePos),
		LineEnd:    int32(params.EndLinePos),
		CharStart:  int32(params.StartCharPos),
		CharEnd:    int32(params.EndCharPos),
		Body:       params.Text,
		Repo:       params.Repo,
		CommitHash: params.CommitHash,
		FilePath:   params.FilePath,
		Author:     params.Author,
		UserID:     user.ID,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Couldn't create comment: %s", err))
		return
	}

	// Format the response
	dateStr := ""
	if createdComment.CreatedAt.Valid {
		dateStr = createdComment.CreatedAt.Time.Format("2006-01-02 15:04:05")
	}

	respondWithJSON(w, http.StatusCreated, Comment{
		ID:        createdComment.ID.String(),
		Author:    createdComment.Author,
		Body:      createdComment.Body,
		Date:      dateStr,
		FilePath:  createdComment.FilePath,
		Repo:      createdComment.Repo,
		Resolved:  createdComment.Resolved.Bool,
		AvatarURL: user.Avatar,
	})
}

func (cfg *apiConfig) getCommentHandler(w http.ResponseWriter, r *http.Request) {
	repo := r.URL.Query().Get("repo")
	if repo == "" {
		respondWithError(w, 400, "Missing repo parameter")
		return
	}

	comments, err := cfg.queries.GetCommentsByRepo(context.Background(), repo)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error getting comments: %s", err))
		return
	}

	if len(comments) == 0 {
		respondWithJSON(w, http.StatusOK, []Comment{})
		return
	}

	// Get unique user IDs to batch fetch users
	userIDs := make([]uuid.UUID, 0)
	userIDSet := make(map[uuid.UUID]bool)

	for _, comment := range comments {
		if !userIDSet[comment.UserID] {
			userIDs = append(userIDs, comment.UserID)
			userIDSet[comment.UserID] = true
		}
	}

	// Create a map of user ID to avatar URL
	userAvatars := make(map[uuid.UUID]string)
	for _, userID := range userIDs {
		user, err := cfg.queries.GetUserByID(context.Background(), userID)
		if err == nil {
			userAvatars[userID] = user.Avatar
		}
	}

	var responseComments []Comment
	for _, comment := range comments {
		dateStr := ""
		if comment.CreatedAt.Valid {
			dateStr = comment.CreatedAt.Time.Format("2006-01-02 15:04:05")
		}

		avatarURL := userAvatars[comment.UserID]

		responseComments = append(responseComments, Comment{
			ID:        comment.ID.String(),
			Author:    comment.Author,
			Body:      comment.Body,
			FilePath:  comment.FilePath,
			Repo:      comment.Repo,
			Resolved:  comment.Resolved.Bool,
			AvatarURL: avatarURL,
			Date:      dateStr,
		})
	}

	respondWithJSON(w, http.StatusOK, responseComments)
}
