-- SELECT * FROM petition
-- DELETE FROM users WHERE id = 1;
-- ALTER SEQUENCE signatures_id_seq RESTART WITH 1;
-- DELETE FROM signatures WHERE user_id = 2;
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;
--

-- SELECT * FROM users;
-- SELECT id, user_id FROM signatures;
-- SELECT * FROM user_profiles;

-- SELECT firstname, lastname, age, city, url FROM users
-- JOIN signatures ON users.id = signatures.user_id
-- JOIN user_profiles ON users.id = user_profiles.user_id
-- WHERE city = 'Berlin';

SELECT firstname, lastname, age, city, url FROM users
JOIN signatures ON users.id = signatures.user_id
JOIN user_profiles ON users.id = user_profiles.user_id
WHERE age = 35;


-- CREATE TABLE user_profiles(
--     id SERIAL PRIMARY KEY,
--     age INT,
--     city VARCHAR,
--     url VARCHAR,
--     user_id INT REFERENCES users(id) NOT NULL UNIQUE
-- );

-- ALTER TABLE signatures DROP COLUMN lastname;
--
-- SELECT * FROM users;
-- SELECT id, user_id, timestamp FROM signatures;

-- SELECT FIRSTNAME, LASTNAME FROM users JOIN signatures ON users.id = signatures.user_id;




-- ALTER TABLE petition DROP COLUMN timestamp;
-- ALTER TABLE petition ADD COLUMN timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
-- ALTER TABLE signatures DROP COLUMN firstname;
-- ALTER TABLE petition DROP COLUMN lastname;
-- ALTER TABLE petition DROP COLUMN signature;
-- ALTER TABLE petition DROP COLUMN timestamp;


-- ALTER TABLE petition ADD COLUMN firstname varchar(255) NOT NULL;
-- ALTER TABLE petition ADD COLUMN lastname varchar(255) NOT NULL;
-- ALTER TABLE petition ADD COLUMN signature varchar NOT NULL;
-- ALTER TABLE users ADD COLUMN timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;


-- SELECT * FROM petition;
-- SELECT * FROM users;
-- SELECT * FROM user_profiles;


-- SELECT COUNT(*) AS NUMBEROFSIGNERS FROM petition;
-- SELECT FIRSTNAME, LASTNAME, TIMESTAMP FROM petition;

-- DELETE FROM petition;


-- SELECT COUNT(*) FROM petition;
-- SELECT SIGNATURE FROM petition WHERE id = 2;

--
-- CREATE TABLE SIGNATURES (
--    id SERIAL primary key,
--    firstname VARCHAR(255) NOT NULL,
--    lastname VARCHAR(255) NOT NULL,
--    signature VARCHAR NOT NULL,
--    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
-- user_id INT REFERENCES users(id) NOT NULL UNIQUE,


-- DROP TABLE users;
