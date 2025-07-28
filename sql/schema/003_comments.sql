-- +goose Up
ALTER TABLE comments
ADD COLUMN char_start INTEGER NOT NULL;

ALTER TABLE comments
ADD COLUMN char_end INTEGER NOT NULL;

-- +goose Down
ALTER TABLE comments
DROP COLUMN char_start;

ALTER TABLE comments
DROP COLUMN char_end;
