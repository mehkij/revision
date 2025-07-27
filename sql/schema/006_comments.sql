-- +goose Up
ALTER TABLE comments
ADD COLUMN user_id UUID NOT NULL;

ALTER TABLE comments
ADD CONSTRAINT fk_comments_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

-- +goose Down
ALTER TABLE comments
DROP CONSTRAINT fk_comments_user;

ALTER TABLE comments
DROP COLUMN user_id;
