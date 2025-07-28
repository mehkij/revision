package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/mehkij/revision/internal/auth"
	"github.com/mehkij/revision/internal/database"
)

type Comment struct {
	StartLinePos int    `json:"startLinePos"`
	StartCharPos int    `json:"startCharPos"`
	EndLinePos   int    `json:"endLinePos"`
	EndCharPos   int    `json:"endCharPos"`
	Text         string `json:"text"`
	Author       string `json:"author"`
	FilePath     string `json:"filePath"`
	Repo         string `json:"repo"`
	CommitHash   string `json:"commitHash"`
	Resolved     bool   `json:"resolved"`
}

func (cfg *apiConfig) createCommentHandler(w http.ResponseWriter, r *http.Request) {
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
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Coudln't decode response body: %s", err))
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
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Coudln't decode create comment: %s", err))
		return
	}

	respondWithJSON(w, http.StatusCreated, Comment{
		StartLinePos: int(createdComment.LineStart),
		StartCharPos: int(createdComment.LineEnd),
		EndLinePos:   int(createdComment.LineEnd),
		EndCharPos:   int(createdComment.CharEnd),
		Text:         createdComment.Body,
		Author:       createdComment.Author,
		FilePath:     createdComment.FilePath,
		Repo:         createdComment.Repo,
		CommitHash:   createdComment.CommitHash,
		Resolved:     createdComment.Resolved.Bool,
	})

}

func (cfg *apiConfig) getCommentHandler(w http.ResponseWriter, r *http.Request) {
	repo := r.URL.Query().Get("repo")
	if repo == "" {
		respondWithError(w, 400, "Missing repo parameter")
		return
	}

	// Authorize user
	token, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, 500, fmt.Sprintf("Error getting token: %s", err))
		return
	}

	_, err = auth.ValidateJWT(token, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, 401, "Invalid token")
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

	respondWithJSON(w, http.StatusOK, comments)
}
