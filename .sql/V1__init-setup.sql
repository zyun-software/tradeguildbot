CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    route VARCHAR(64) NOT NULL DEFAULT 'home',
    data JSON NOT NULL DEFAULT '{}'
);

INSERT INTO users (id) VALUES (494209756);

CREATE TABLE guilds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(32) NOT NULL,
    owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    active BOOLEAN NOT NULL
);

INSERT INTO guilds (name, owner_id, active) VALUES ('Орден Троянди Візера', 494209756, TRUE);

CREATE TABLE guild_members (
    id SERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    guild_id BIGINT REFERENCES guilds(id) ON DELETE CASCADE,
    name VARCHAR(32) NOT NULL,
    approved BOOLEAN NOT NULL,
    CONSTRAINT unique_guild_member UNIQUE (guild_id, name)
);

INSERT INTO guild_members (user_id, guild_id, name, approved) VALUES (494209756, 1, 'Ziozyun', TRUE);

CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    guild_id BIGINT REFERENCES guilds(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL,
    name VARCHAR(32) NOT NULL,
    CONSTRAINT uc_guild_code UNIQUE (guild_id, code)
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    guild_member_id BIGINT REFERENCES guild_members(id) ON DELETE CASCADE,
    currency_id BIGINT REFERENCES currencies(id) ON DELETE CASCADE,
    balance INTEGER NOT NULL DEFAULT 0,
    reserve INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT uc_member_currency UNIQUE (guild_member_id, currency_id)
);

CREATE TYPE money_request_type AS ENUM ('introduction', 'receiving');

CREATE TABLE money_request (
    id SERIAL PRIMARY KEY,
    account_id BIGINT UNIQUE REFERENCES accounts(id) ON DELETE CASCADE,
    type money_request_type NOT NULL,
    amount INTEGER NOT NULL
);

CREATE TABLE exchange_proposals (
    id SERIAL PRIMARY KEY,
    guild_member_id BIGINT REFERENCES guild_members(id) ON DELETE CASCADE,
    from_currency_id BIGINT REFERENCES currencies(id) ON DELETE CASCADE,
    from_amount INTEGER NOT NULL,
    to_currency_id BIGINT REFERENCES currencies(id) ON DELETE CASCADE,
    to_amount INTEGER NOT NULL
);
