-- SELECT * FROM petition
-- DELETE FROM petition WHERE firstname = 'majid';
-- SELECT * FROM petition;
-- ALTER SEQUENCE petition_id_seq RESTART WITH 1;


-- ALTER TABLE petition DROP COLUMN timestamp;
-- ALTER TABLE petition ADD COLUMN timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
-- ALTER TABLE petition DROP COLUMN firstname;
-- ALTER TABLE petition DROP COLUMN lastname;
-- ALTER TABLE petition DROP COLUMN signature;
-- ALTER TABLE petition DROP COLUMN timestamp;


-- ALTER TABLE petition ADD COLUMN firstname varchar(255) NOT NULL;
-- ALTER TABLE petition ADD COLUMN lastname varchar(255) NOT NULL;
-- ALTER TABLE petition ADD COLUMN signature varchar NOT NULL;
-- ALTER TABLE petition ADD COLUMN timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;


-- SELECT * FROM petition;
-- SELECT COUNT(*) AS NUMBEROFSIGNERS FROM petition;
-- SELECT FIRSTNAME, LASTNAME FROM petition;

-- DELETE FROM petition;


-- SELECT COUNT(*) FROM petition;
SELECT SIGNATURE FROM petition WHERE id = 2;
