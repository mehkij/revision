-- name: CreateComment :one
INSERT INTO comments (id, file_path, commit_hash, line_start, line_end, author, body, resolved)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7
)
RETURNING *;

-- name: GetComment :one
SELECT * FROM comments WHERE id=$1;
