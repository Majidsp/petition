const spicedPg = require('spiced-pg');
let db = spicedPg('postgres:postgres:12345@localhost:5432/petition');


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
        `SELECT firstname, lastname FROM users JOIN signatures ON users.id = signatures.user_id;`
    );
};

const signUp = (firstname, lastname, emailaddress, password) => {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING firstname, id;`,
        [firstname, lastname, emailaddress, password]
    );
};

const logIn = (emailaddress) => {
    return db.query(
        `SELECT id, firstname, password FROM users WHERE email = $1;`,
        [emailaddress]
    );
};

module.exports = {
    enterInfo: enterInfo,
    countSigners: countSigners,
    getSignature: getSignature,
    listOfSigners: listOfSigners,
    signUp: signUp,
    logIn: logIn
};
