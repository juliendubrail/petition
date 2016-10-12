DROP TABLE IF EXISTS signs;
CREATE TABLE signs (
    id SERIAL primary key,
    firstname VARCHAR(255) not null,
    lastname VARCHAR(255) not null,
    signature TEXT
);
