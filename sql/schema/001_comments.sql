-- +goose Up
CREATE TABLE comments (
    id UUID PRIMARY KEY,
    file_path TEXT NOT NULL,
    repo TEXT NOT NULL,
    commit_hash TEXT NOT NULL,
    line_start INTEGER NOT NULL,
    line_end INTEGER NOT NULL,
    author TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    resolved BOOLEAN DEFAULT FALSE
);

-- +goose Down
DROP TABLE comments;
