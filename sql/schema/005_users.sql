-- +goose Up
ALTER TABLE users
ADD COLUMN github_token TEXT;

-- +goose Down
ALTER TABLE users
DROP COLUMN github_token;
