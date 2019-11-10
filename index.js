const express = require('express');
const app = express();
const hb = require('express-handlebars');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const helmet = require('helmet');
const db = require('./db');
const { toHash, toCompare } = require('./encode');
const mw = require('./middleware.js');


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
app.use((req, res, next) => {
    res.set("x-frame-options", "DENY");
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(mw.requireLoggedInUser);



// 1
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/welcome', (req, res) => res.render('welcome'));

// 2
app.post('/signup', (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if(!firstname || !lastname || !email || !password) {
        res.render('signup', {error: true});
    } else {
        toHash(password)
            .then( result => db.signUp(firstname, lastname, email, result)
            ).then( ({ rows }) => {
                req.session.firstname = rows[0].firstname;
                req.session.lastname = rows[0].lastname;
                req.session.email = rows[0].email;
                req.session.id = rows[0].id;
                res.redirect('/profile');
            }
            ).catch(() => res.render('signup', {error: true}));
    }
});

// 3
app.get('/profile', (req, res) => res.render('profile'));


// 4
app.post('/profile', (req, res) => {
    const { age, city, url } = req.body;
    return db.enterProfileInfo(age, city, url, req.session.id)
        .then( (result) => {
            result.age ? req.session.age = result.age : req.session.age = '';
            result.city ? req.session.city = result.city : req.session.city = '';
            result.url ? req.session.url = result.url : req.session.url = '';
            res.redirect('/petition');
        })
        .catch(() => res.render('profile', {error: true}));
});

// 5
app.get('/profile/edit', (req, res) => {
    res.render('editprofile', { firstname: req.session.firstname, lastname: req.session.lastname,
        email: req.session.email, age: req.session.age, city: req.session.city, url: req.session.url}
    );
}
);

// 6
app.post('/profile/edit', (req, res) => {
    const { firstname, lastname, email, password, age, city, url } = req.body;

    toHash(password)
        .then(result => {
            return Promise.all([
                db.updatePassword(result, req.session.id, password),
                db.updateInfoInUsers(firstname, lastname, email, req.session.id),
                db.updateInfoInUser_profiles(age, city, url, req.session.id)
            ]);
        }).then(() => res.redirect('/profile/edit'))
        .catch((err) => {
            console.log(err);
            res.render('editprofile', {error: true, firstname: req.session.firstname, lastname: req.session.lastname,
                email: req.session.email, age: req.session.age, city: req.session.city, url: req.session.url}
            );
        });
});


// 7
app.get('/login', (req, res) => res.render('login') );

// 8
app.post('/login', (req, res) => {
    let firstname, lastname, email, id;

    return db.logIn(req.body.email)
        .then(({ rows }) => {
            firstname = rows[0].firstname;
            lastname = rows[0].lastname;
            email = rows[0].email;
            id = rows[0].id;
            return Promise.all([
                toCompare(req.body.password, rows[0].password),
                db.getInfoFromUser_profilesToUpdate(id)
            ]);
        }
        ).then(result => {
            if(result[0]) {
                req.session.firstname = firstname;
                req.session.lastname = lastname;
                req.session.email = email;
                req.session.id = id;
                result[1].age ? req.session.age = result[1].age : req.session.age = '';
                result[1].city ? req.session.city = result[1].city : req.session.city = '';
                result[1].url ? req.session.url = result[1].url : req.session.url = '';
                return db.checkIfSigned(id);
            } else if(!result[0]) {
                throw new Error;
            }
        }
        ).then( ({ rows }) => {
            if(rows[0] && rows[0].user_id) {
                req.session.sign = true;
            }

            res.redirect('/petition');
        }
        ).catch(() => res.render('login', {error: true}));
});

// 9
// app.get('/', (req, res) => res.redirect('/petition'));


// 10
app.get('/petition', (req, res) => res.render('petition'));


// 11
app.post('/petition', (req, res) => {
    const { signature } = req.body;

    if(!signature){
        res.render('petition', {error: true});
    } else {
        db.enterInfo(signature, req.session.id)
            .then(() => {
                req.session.sign = true;
                res.redirect('/thanks');
            }
            ).catch((err) => {
                console.log(err);
                res.render('petition', {error: true});
            });
    }

});


// 12
app.get('/thanks', mw.requireSignature, mw.requireSignature, (req, res) => {
    let id = req.session.id;
    let numberOfSigners = 0;
    return db.countSigners()
        .then(({ rows }) => {
            numberOfSigners = rows[0].numberofsigners;
            return db.getSignature(id);
        }).then( ({ rows }) => {
            res.render('thanks', {signers: numberOfSigners, signature: rows[0].signature,
                name :req.session.firstname,
                id: req.session.id});
        })
        .catch(err => console.error(err));
});


// 13
app.get('/signers', mw.requireSignature, mw.requireSignature, (req, res) => {
    return db.listOfSigners()
        .then( ({ rows }) => res.render('signers', { signersList: rows}))
        .catch(err => console.error(err));
});

// 14
app.get("/signers/:filter", mw.requireSignature,mw.requireSignature, (req, res) => {
    let { filter } = req.params;
    return db.filteredListOfSignersByCity(filter)
        .then( ({ rows }) => res.render('signers', {signersList: rows}))
        .catch(err => console.error(err));
});


// 15
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});


app.listen(process.env.PORT || 8080, () => console.log(`I'm listening.`));
