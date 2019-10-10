const express = require('express');
const app = express();
const hb = require('express-handlebars');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const helmet = require('helmet');
const { enterInfo, countSigners, getSignature, listOfSigners,
    signUp, logIn, checkIfSigned, enterProfileInfo, filteredListOfSignersByAge,
    filteredListOfSignersByCity } = require('./db');
const { toHash, toCompare } = require('./encode');

//Do not forget to secure against this
// const filterUrl = url => {
//     return url.search(/https|http|\/\//i) === 0 ? url : null;
// };


//Middleware for helmet
app.use(helmet());

//Middleware for cookieSession
app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

//Middleware for handlebars
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

//Middleware for loading files from public folder
app.use(express.static('./public'));

//Middleware for parsing request body
app.use(express.urlencoded({extended: false}));

//Middleware for csurf and securing against iframes
app.use(csurf());

app.use(function(req, res, next) {
    //iframes
    res.set("x-frame-options", "DENY");
    //
    res.locals.csrfToken = req.csrfToken();
    next();
});


//1
app.get('/signup', (req, res) => {
    res.render('signup');
});

//2
app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName || !email || !password) {
        res.render('signup', {error: true});
    } else {
        toHash(password)
            .then( result => signUp(firstName, lastName, email, result)
            ).then( ({ rows }) => {
                req.session.name = rows[0].firstname;
                req.session.id = rows[0].id;
                res.redirect('/login');
            }
            ).catch(() => res.render('signup', {error: true}));
    }
});

//3
app.get('/profile', (req, res) => {
    res.render('profile');
});

//3
app.post('/profile', (req, res) => {
    const { age, city, homepage } = req.body;
    console.log(age, city, homepage);
    return enterProfileInfo(age, city, homepage, req.session.id)
        .then( () => res.redirect('/login'))
        .catch((err) => {
            res.render('profile', {error: true});
            console.log(err);
        });
});

//3
app.get('/login', (req, res) => {
    req.session.name ? res.redirect('/petition') : res.render('login');
});

//4
app.post('/login', (req, res) => {
    let name, id;
    const { email, password } = req.body;
    return logIn(email)
        .then(({ rows }) => {
            name = rows[0].firstname;
            id = rows[0].id;
            return toCompare(password, rows[0].password);
        }
        ).then(result => {
            if(result) {
                req.session.name = name;
                req.session.id = id;
                return checkIfSigned(id);
            } else {
                res.render('login', {error: true});
            }
        }
        ).then( ({ rows }) => {
            if(rows[0].user_id) {
                req.session.sign = true;
            }

            res.redirect('/petition');
        }
        ).catch(err => console.log(err));
});

// 5
app.get('/', (req, res) => {
    req.session.name ? res.redirect('/petition') : res.redirect('/signup');
});


// 6
app.get('/petition', (req, res) => {
    if(req.session.name) {
        req.session.sign ? res.redirect('/thanks') : res.render('petition');
    } else {
        res.redirect('/signup');
    }
});


// 7
app.post('/petition', (req, res) => {
    const { signature } = req.body;

    if(!signature){
        res.render('petition', {error: true});
    } else {
        enterInfo(signature, req.session.id)
            .then(() => {
                req.session.sign = true;
                res.redirect('/thanks');
            }).catch(() => {
                res.render('petition', {error: true});
            });
    }

});


// 8
app.get('/thanks', (req, res) => {
    if(req.session.name) {
        if(req.session.sign) {
            let id = req.session.id;
            let numberOfSigners = 0;
            return countSigners()
                .then(({ rows }) => {
                    numberOfSigners = rows[0].numberofsigners;
                    return getSignature(id);
                }).then( ({ rows }) => {
                    res.render('thanks', {signers: numberOfSigners, signature: rows[0].signature});
                }).catch(err => {
                    console.error(err);
                });
        } else {
            res.render('petition');
        }
    } else {
        res.redirect('/signup');
    }

});


// 9
app.get('/signers', (req, res) => {
    if(req.session.name) {
        if(req.session.sign) {
            return listOfSigners()
                .then( ({ rows }) => {
                    res.render('signers', { signersList: rows});
                }).catch(err => {
                    console.error(err);
                });
        } else {
            res.render('petition');
        }
    } else {
        res.redirect('/signup');
    }

});

app.get("/signers/:filter", (req, res) => {
    let { filter } = req.params;
    // let newfilter;
    // isNaN(parseInt(filter)) ? newfilter = filter : newfilter = parseInt(filter);
    if(req.session.name) {
        if(req.session.sign) {
            return filteredListOfSignersByCity(filter)
            // isNaN(newfilter) ? filteredListOfSignersByCity(newfilter) : filteredListOfSignersByAge(newfilter);
                .then( ({ rows }) => {
                    res.render('signers', {signersList: rows});
                }).catch(err => {
                    console.error(err);
                });
        } else {
            res.render('petition');
        }
    } else {
        res.redirect('/signup');
    }
});


app.listen(8080, () => console.log(`I'm listening.`));
