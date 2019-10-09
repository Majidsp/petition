const express = require('express');
const app = express();
const hb = require('express-handlebars');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const helmet = require('helmet');
const { enterInfo, countSigners, getSignature, listOfSigners, signUp, logIn } = require('./db');
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

//Middleware for blocking access to users that have not signed the petition
// app.use(
//     (req, res, next) => {
//         if (!req.session.id) {
//             if(req.url != '/petition') {
//                 return res.redirect('/petition');
//             } else {
//                 return next();
//             }
//         }
//         return next();
//     }
// );

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
                req.session.userId = rows[0].id;
                res.redirect('/logIn');
            }
            ).catch(() => res.render('signup', {error: true}));
    }
});

//3
app.get('/login', (req, res) => {
    res.render('login');
});

//4
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    return logIn(email)
        .then(({ rows }) => toCompare(password, rows[0].password))
        .then(result => result ? res.redirect('/petition') : res.render('login', {error: true})
        ).catch(err => console.log(err));
});



// 5
app.get('/', (req, res) => {
    req.session.sign ? res.redirect('thanks') : res.redirect('/petition');
});


// 6
app.get('/petition', (req, res) => {
    req.session.sign ? res.redirect('thanks') : res.render('petition');
});


// 7
app.post('/petition', (req, res) => {

    const { signature } = req.body;

    if(!signature){
        res.render('petition', {error: true});
    } else {
        enterInfo(signature, req.session.userId)
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
    let id = req.session.userId;
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
});


// 9
app.get('/signers', (req, res) => {
    return listOfSigners()
        .then( ({ rows }) => {
            res.render('signers', {signersList: rows});
        }).catch(err => {
            console.error(err);
        });
});





app.listen(8080, () => console.log(`I'm listening.`));
