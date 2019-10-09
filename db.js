const spicedPg = require('spiced-pg');
let db = spicedPg('postgres:postgres:12345@localhost:5432/petition');


const enterInfo = (firstname, lastname, signature) => {
    return db.query(
        `INSERT INTO petition (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING id`,
        [firstname, lastname, signature]
    );
};

const countSigners = () => {
    return db.query(
        `SELECT COUNT(*) AS NUMBEROFSIGNERS FROM petition;`
    );
};

const getSignature = id => {
    return db.query(
        `SELECT SIGNATURE FROM petition WHERE id = $1;`,
        [id]
    );
};

const listOfSigners = () => {
    return db.query(
        `SELECT FIRSTNAME, LASTNAME FROM petition;`
    );
};

const signUp = (firstname, lastname, emailaddress, password) => {
    return db.query(
        `INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id;`,
        [firstname, lastname, emailaddress, password]
    );
};

const logIn = (emailaddress) => {
    return db(
        `SELECT password FROM users WHERE email = $1;`,
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
