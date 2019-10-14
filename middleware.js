const requireLoggedInUser = (req, res, next) => {
    if (!req.session.id && req.url != '/signup' && req.url != '/login') {
        res.redirect('/signup');
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
