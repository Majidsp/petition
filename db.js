const spicedPg = require('spiced-pg');
let db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:12345@localhost:5432/petition');


const enterInfo = (signature, userId) => {
    return db.query(
        `INSERT INTO signatures (signature, user_id)
        VALUES ($1, (SELECT id FROM users WHERE id = $2));`,
        [signature, userId]
    );
};

const countSigners = () => {
    return db.query(
        `SELECT COUNT(*) AS numberofsigners FROM signatures;`
    );
};

const getSignature = id => {
    return db.query(
        `SELECT signature FROM signatures WHERE user_id = $1;`,
        [id]
    );
};

const listOfSigners = () => {
    return db.query(
        `SELECT firstname, lastname, age, city, url FROM users
        JOIN signatures ON users.id = signatures.user_id
        LEFT JOIN user_profiles ON users.id = user_profiles.user_id;`
    );
};

const filteredListOfSignersByAge = (value) => {
    return db.query(
        `SELECT firstname, lastname, age, city, url FROM users
        JOIN signatures ON users.id = signatures.user_id
        LEFT JOIN user_profiles ON users.id = user_profiles.user_id
        WHERE age = $1;`,
        [value]
    );
};

const filteredListOfSignersByCity = (value) => {
    return db.query(
        `SELECT firstname, lastname, age, city, url FROM users
        JOIN signatures ON users.id = signatures.user_id
        LEFT JOIN user_profiles ON users.id = user_profiles.user_id
        WHERE LOWER(city) = LOWER($1);`,
        [value]
    );
};

const signUp = (firstname, lastname, emailaddress, password) => {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING firstname, lastname, email, id;`,
        [firstname, lastname, emailaddress, password]
    );
};

const logIn = emailaddress => {
    return db.query(
        `SELECT id, firstname, lastname, email, password FROM users WHERE email = $1;`,
        [emailaddress]
    );
};

const checkIfSigned = id => {
    return db.query(
        `SELECT user_id FROM signatures WHERE user_id = $1;`,
        [id]
    );
};

const enterProfileInfo = (age, city, url, userId) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, (SELECT id FROM users WHERE id = $4))
        RETURNING age, city, url;`,
        [age, city, url, userId]
    );
};

const getInfoFromUsersToUpdate = (id) => {
    return db.query(
        `SELECT firstname, lastname, email, password FROM users WHERE id = $1`,
        [id]
    );
};

const getInfoFromUser_profilesToUpdate = (id) => {
    return db.query(
        `SELECT age, city, url FROM user_profiles WHERE user_id = $1`,
        [id]
    );
};

const updateInfoInUsers = (firstname, lastname, email, id) => {
    return db.query(
        `UPDATE users SET firstname = $1, lastname = $2, email = $3 WHERE id = $4
        RETURNING firstname, lastname, email;`,
        [firstname, lastname, email, id]
    );
};


// >>>>> Conditional version of updatepassword function to later use
// const updatePassword = (password, id) => {
//     return db.query(
//         `UPDATE users SET password = CASE WHEN $1 != 'f' THEN $1 ELSE users.password END WHERE id = $2;`,
//         [password, id]
//     );
// };

const updatePassword = (password, id, doOrNot) => {
    return db.query(
        `UPDATE users SET password = CASE WHEN $3 != 'f' THEN $1 ELSE users.password END WHERE id = $2;`,
        [password, id, doOrNot]
    );
};

const updateInfoInUser_profiles = (age, city, url, id) => {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) DO UPDATE SET age = $1, city = $2, url = $3
        RETURNING age, city, url;`,
        [age, city, url, id]
    );
};


// CASE WHEN CONDITION THEN pt.value = 14, pt.anothervalue = 20 END
//
// UPDATE users
//         SET first = $1, last = $2, email = $3, password = COALESCE($4, password)
//         WHERE id = $5
//         RETURNING id AS user_id, first AS first, last AS last, email AS email;`,
//                 [first, last, email, password, user_id]
// const updateInfoInUser_profiles = (id) {
//
// };


module.exports = {
    enterInfo: enterInfo,
    countSigners: countSigners,
    getSignature: getSignature,
    listOfSigners: listOfSigners,
    signUp: signUp,
    logIn: logIn,
    checkIfSigned: checkIfSigned,
    enterProfileInfo: enterProfileInfo,
    filteredListOfSignersByAge: filteredListOfSignersByAge,
    filteredListOfSignersByCity: filteredListOfSignersByCity,
    getInfoFromUsersToUpdate: getInfoFromUsersToUpdate,
    getInfoFromUser_profilesToUpdate: getInfoFromUser_profilesToUpdate,
    updateInfoInUsers: updateInfoInUsers,
    updatePassword: updatePassword,
    updateInfoInUser_profiles: updateInfoInUser_profiles
    // updateInfoInUser_profiles: updateInfoInUser_profiles
};
