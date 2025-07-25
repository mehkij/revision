package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/mehkij/revision/internal/database"
)

type apiConfig struct {
	queries *database.Queries
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

	apiCfg := &apiConfig{
		queries: dbQueries,
	}

	mux := http.NewServeMux()

	// API
	mux.HandleFunc("POST /api/v1/comments", apiCfg.createCommentHandler)
	mux.HandleFunc("GET /api/v1/comments", apiCfg.getCommentHandler)

	server := http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	log.Printf("server starting on port: %s\n", server.Addr)
	err = server.ListenAndServe()
	if err != nil {
		log.Fatalf("error starting server: %s", err)
	}
}
