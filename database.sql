-- DROP TABLE IF EXISTS user_profiles;

-- CREATE TABLE user_profiles(
--     id SERIAL PRIMARY KEY,
--     age INT,
--     city VARCHAR,
--     url VARCHAR,
--     user_id INT REFERENCES users(id) NOT NULL UNIQUE
-- );


-- DROP TABLE IF EXISTS users;

-- CREATE TABLE users(
-- id SERIAL PRIMARY KEY,
-- firstname VARCHAR NOT NULL,
-- lastname VARCHAR NOT NULL,
-- email VARCHAR NOT NULL UNIQUE,
-- password VARCHAR NOT NULL
-- );


-- DROP TABLE IF EXISTS signatures;

-- CREATE TABLE signatures (
--    id SERIAL primary key,
--    signature VARCHAR NOT NULL,
--    user_id INT REFERENCES users(id) NOT NULL UNIQUE,
--    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
