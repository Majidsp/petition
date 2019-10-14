const requireLoggedInUser = (req, res, next) => {
    if (!req.session.id && req.url != '/signup' && req.url != '/login' && req.url != '/welcome') {
        res.redirect('/welcome');
    } else {
        next();
    }
};

function requireSignature(req, res, next) {
    if (!req.session.sign) {
        res.redirect('/petition');
    } else {
        next();
    }
}



module.exports = {
    requireLoggedInUser,
    requireSignature
};
