package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/mehkij/revision/internal/database"
)

type apiConfig struct {
	queries   *database.Queries
	github    *githubClient
	jwtSecret string
}

type githubClient struct {
	clientID     string
	clientSecret string
}

func main() {
	godotenv.Load()
	dbURL := os.Getenv("DB_URL")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("unable to open connection to database: %s", err)
	}
	defer db.Close()

	dbQueries := database.New(db)
	jwtSecret := os.Getenv("JWT_SECRET")

	clientID := os.Getenv("GITHUB_CLIENT_ID")
	clientSecret := os.Getenv("GITHUB_CLIENT_SECRET")

	githubClient := &githubClient{
		clientID:     clientID,
		clientSecret: clientSecret,
	}

	apiCfg := &apiConfig{
		queries:   dbQueries,
		github:    githubClient,
		jwtSecret: jwtSecret,
	}

	mux := http.NewServeMux()

	// API
	mux.HandleFunc("POST /api/v1/comments", corsMiddleware(apiCfg.createCommentHandler))
	mux.HandleFunc("GET /api/v1/comments", corsMiddleware(apiCfg.getCommentHandler))

	mux.HandleFunc("GET /auth/github/callback", apiCfg.handleGitHubCallback)

	server := &http.Server{
		Addr:              ":8080",
		Handler:           mux,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("server starting on address: %s\n", server.Addr)
	err = server.ListenAndServe()
	if err != nil {
		log.Fatalf("error starting server: %s", err)
	}
}
