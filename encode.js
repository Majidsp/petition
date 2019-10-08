let { genSalt, hash, compare } = require("bcryptjs");
const { promisify } = require("util");

//bcrypt
genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

const toHash = password => genSalt().then(
    salt => hash(password, salt)
);

const toCompare = (password, hash) =>  compare(password, hash);


module.exports = {
    toHash: toHash,
    toCompare: toCompare
};
