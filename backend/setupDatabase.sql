CREATE TABLE IF NOT EXISTS users (
    username VARCHAR (64) PRIMARY KEY,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS channels (
    channel VARCHAR (32) PRIMARY KEY,
    name TEXT,
    channel_owner VARCHAR (64) REFERENCES users(username) ON DELETE CASCADE
);
