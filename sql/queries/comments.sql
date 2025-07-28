-- name: CreateComment :one
INSERT INTO comments (id, file_path, commit_hash, repo, line_start, line_end, char_start, char_end, author, body, resolved)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10
)
RETURNING *;

-- name: GetComment :one
SELECT * FROM comments WHERE id=$1;

-- name: GetCommentsByUser :many
SELECT * FROM comments WHERE user_id=$1;

-- name: GetCommentsByRepo :many
SELECT * FROM comments WHERE (repo=$1);
