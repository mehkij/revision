-- name: CreateComment :one
INSERT INTO comments (id, file_path, commit_hash, repo, line_start, line_end, char_start, char_end, author, body, resolved, user_id)
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
    $10,
    $11
)
RETURNING *;

-- name: GetComment :one
SELECT * FROM comments WHERE id=$1;

-- name: GetCommentsByUser :many
SELECT * FROM comments WHERE user_id=$1;

-- name: GetCommentsByRepo :many
SELECT * FROM comments WHERE (repo=$1);

-- name: GetCommentsByRepoWithUsers :many
SELECT 
    c.id,
    c.file_path,
    c.repo,
    c.commit_hash,
    c.line_start,
    c.line_end,
    c.char_start,
    c.char_end,
    c.author,
    c.body,
    c.created_at,
    c.updated_at,
    c.resolved,
    c.user_id,
    u.avatar as avatar_url
FROM comments c
LEFT JOIN users u ON c.user_id = u.id
WHERE c.repo = $1
ORDER BY c.created_at DESC;
