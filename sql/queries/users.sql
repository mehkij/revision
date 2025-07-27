-- name: CreateUser :one
INSERT INTO users (id, github_id, username, avatar, github_token)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4
)
RETURNING *;

-- name: GetUser :one
SELECT * FROM users WHERE (github_id=$1);
