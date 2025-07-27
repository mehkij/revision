-- +goose Up
ALTER TABLE comments
ADD COLUMN char_start INTEGER NOT NULL;

ALTER TABLE comments
ADD COLUMN char_end INTEGER NOT NULl;

-- +goose Down
ALTER TABLE comments
DROP COLUMN start_char;

ALTER TABLE comments
DROP COLUMN end_char;