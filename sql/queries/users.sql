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

-- name: GetUserByGitHubID :one
SELECT * FROM users WHERE (github_id=$1);

-- name: GetUserByID :one
SELECT * FROM users WHERE id=$1;

-- name: UpsertUser :one
INSERT INTO users (id, github_id, username, avatar, github_token)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4
)
ON CONFLICT (github_id) DO UPDATE SET avatar = EXCLUDED.avatar
RETURNING *;
