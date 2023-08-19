CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    route VARCHAR(64) NOT NULL,
    data JSON NOT NULL
);

CREATE TABLE guilds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    active BOOLEAN NOT NULL
);

CREATE TABLE guild_members (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    guild_id BIGINT REFERENCES guilds(id) ON DELETE CASCADE,
    name VARCHAR(32) NOT NULL,
    approved BOOLEAN NOT NULL
);

CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    guild_id BIGINT REFERENCES guilds(id) ON DELETE CASCADE,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(32) NOT NULL
);

CREATE TABLE guild_treasury (
    id SERIAL PRIMARY KEY,
    guild_id BIGINT REFERENCES guilds(id) ON DELETE CASCADE,
    currency_id BIGINT REFERENCES currencies(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    guild_member_id BIGINT REFERENCES guild_members(id) ON DELETE CASCADE,
    currency_id BIGINT REFERENCES currencies(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0,
    reserve INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE exchange_proposals (
    id SERIAL PRIMARY KEY,
    guild_member_id BIGINT REFERENCES guild_members(id) ON DELETE CASCADE,
    from_currency_id BIGINT REFERENCES currencies(id) ON DELETE CASCADE,
    from_amount INTEGER NOT NULL,
    to_currency_id BIGINT REFERENCES currencies(id) ON DELETE CASCADE,
    to_amount INTEGER NOT NULL
);
