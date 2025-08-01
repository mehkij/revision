// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: users.sql

package database

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
)

const createUser = `-- name: CreateUser :one
INSERT INTO users (id, github_id, username, avatar, github_token)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4
)
RETURNING id, github_id, username, avatar, created_at, updated_at, github_token
`

type CreateUserParams struct {
	GithubID    int64
	Username    string
	Avatar      string
	GithubToken sql.NullString
}

func (q *Queries) CreateUser(ctx context.Context, arg CreateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, createUser,
		arg.GithubID,
		arg.Username,
		arg.Avatar,
		arg.GithubToken,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.GithubID,
		&i.Username,
		&i.Avatar,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.GithubToken,
	)
	return i, err
}

const getUserByGitHubID = `-- name: GetUserByGitHubID :one
SELECT id, github_id, username, avatar, created_at, updated_at, github_token FROM users WHERE (github_id=$1)
`

func (q *Queries) GetUserByGitHubID(ctx context.Context, githubID int64) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByGitHubID, githubID)
	var i User
	err := row.Scan(
		&i.ID,
		&i.GithubID,
		&i.Username,
		&i.Avatar,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.GithubToken,
	)
	return i, err
}

const getUserByID = `-- name: GetUserByID :one
SELECT id, github_id, username, avatar, created_at, updated_at, github_token FROM users WHERE id=$1
`

func (q *Queries) GetUserByID(ctx context.Context, id uuid.UUID) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserByID, id)
	var i User
	err := row.Scan(
		&i.ID,
		&i.GithubID,
		&i.Username,
		&i.Avatar,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.GithubToken,
	)
	return i, err
}

const upsertUser = `-- name: UpsertUser :one
INSERT INTO users (id, github_id, username, avatar, github_token)
VALUES (
    gen_random_uuid(),
    $1,
    $2,
    $3,
    $4
)
ON CONFLICT (github_id) DO UPDATE SET avatar = EXCLUDED.avatar
RETURNING id, github_id, username, avatar, created_at, updated_at, github_token
`

type UpsertUserParams struct {
	GithubID    int64
	Username    string
	Avatar      string
	GithubToken sql.NullString
}

func (q *Queries) UpsertUser(ctx context.Context, arg UpsertUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, upsertUser,
		arg.GithubID,
		arg.Username,
		arg.Avatar,
		arg.GithubToken,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.GithubID,
		&i.Username,
		&i.Avatar,
		&i.CreatedAt,
		&i.UpdatedAt,
		&i.GithubToken,
	)
	return i, err
}
