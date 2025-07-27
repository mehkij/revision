package main

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/url"

	"github.com/mehkij/revision/internal/database"
)

type GithubUser struct {
	GithubID  int64
	Username  string
	AvatarURL string
}

func (cfg *apiConfig) handleGitHubCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "Missing code", http.StatusBadRequest)
		return
	}

	// Exchange code for access token
	tokenRes, err := http.PostForm("https://github.com/login/oauth/access_token", url.Values{
		"client_id":     {cfg.github.clientID},
		"client_secret": {cfg.github.clientSecret},
		"code":          {code},
	})
	if err != nil {
		http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer tokenRes.Body.Close()

	body, err := io.ReadAll(tokenRes.Body)
	if err != nil {
		http.Error(w, "Failed to read token response", http.StatusInternalServerError)
		return
	}

	// Parse response: format is `access_token=...&scope=...&token_type=bearer`
	values, err := url.ParseQuery(string(body))
	if err != nil {
		http.Error(w, "Failed to parse token response", http.StatusInternalServerError)
		return
	}

	accessToken := values.Get("access_token")
	if accessToken == "" {
		http.Error(w, "Missing access token", http.StatusUnauthorized)
		return
	}

	// Use token to fetch GitHub user info
	req, _ := http.NewRequest("GET", "http://api.github.com/user", nil)
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/json")

	client := http.Client{}
	userRes, err := client.Do(req)
	if err != nil || userRes.StatusCode != 200 {
		http.Error(w, "Failed to fetch user info", http.StatusInternalServerError)
		return
	}
	defer userRes.Body.Close()

	var userData map[string]any
	if err := json.NewDecoder(userRes.Body).Decode(&userData); err != nil {
		http.Error(w, "Failed to decode user JSON", http.StatusInternalServerError)
		return
	}

	// Create new user in the database
	ghUser := GithubUser{
		GithubID:  int64(userData["id"].(float64)),
		Username:  userData["login"].(string),
		AvatarURL: userData["avatar_url"].(string),
	}

	_, err = cfg.queries.CreateUser(context.Background(), database.CreateUserParams{
		GithubID: ghUser.GithubID,
		Username: ghUser.Username,
		Avatar:   ghUser.AvatarURL,
	})
	if err != nil {
		http.Error(w, "Failed to create user in database", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "vscode://revision/auth?token="+accessToken, http.StatusFound)
}
