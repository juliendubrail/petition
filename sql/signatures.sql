-- DROP TABLE IF EXISTS signs;
CREATE TABLE signs (
    id SERIAL primary key,
    firstname VARCHAR(255) not null,
    lastname VARCHAR(255) not null,
    signature TEXT
);

-- DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL primary key,
    firstname VARCHAR(255) not null,
    lastname VARCHAR(255) not null,
    email VARCHAR(255) not null unique,
    password TEXT,
    CreateDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- DROP TABLE IF EXISTS users_profiles;
CREATE TABLE users_profiles (
    id SERIAL primary key,
    user_id INT references users(id),
    age INT not null,
    city VARCHAR(255) not null,
    url VARCHAR(255) not null
);

-- SELECT users.id as user_id
-- FROM users
-- JOIN users_profiles
-- ON users.id = users_profiles.user_id
