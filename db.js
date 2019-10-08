const spicedPg = require('spiced-pg');
let db = spicedPg('postgres:postgres:12345@localhost:5432/petition');

const enterInfo = (firstname, lastname, signature) => {
    return db.query(
        `INSERT INTO petition (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING id`,
        [firstname, lastname, signature]
        // [req.body.firstName, req.body.lastName, req.body.signature]
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

module.exports = {
    enterInfo: enterInfo,
    countSigners: countSigners,
    getSignature: getSignature,
    listOfSigners: listOfSigners
};
