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
}

func (cfg *apiConfig) createCommentHandler(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		StartLinePos int    `json:"startLinePos"`
		StartCharPos int    `json:"startCharPos"`
		EndLinePos   int    `json:"endLinePos"`
		EndCharPos   int    `json:"endCharPos"`
		Text         string `json:"text"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "coudln't decode response body")
		return
	}

	createdComment, err := cfg.queries.CreateComment(r.Context(), database.CreateCommentParams{
		LineStart: int32(params.StartLinePos),
		LineEnd:   int32(params.EndLinePos),
		CharStart: int32(params.StartCharPos),
		CharEnd:   int32(params.EndCharPos),
		Body:      params.Text,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "coudln't decode create comment")
		return
	}

	respondWithJSON(w, http.StatusCreated, Comment{
		StartLinePos: int(createdComment.LineStart),
		StartCharPos: int(createdComment.LineEnd),
		EndLinePos:   int(createdComment.LineEnd),
		EndCharPos:   int(createdComment.CharEnd),
		Text:         createdComment.Body,
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
