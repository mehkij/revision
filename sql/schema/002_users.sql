-- +goose Up
CREATE TABLE users (
    id UUID PRIMARY KEY,
    github_id BIGINT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    avatar TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- +goose Down
DROP TABLE users;
