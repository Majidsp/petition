const express = require('express');
const app = express();
const hb = require('express-handlebars');
const cookieSession = require('cookie-session');
const csurf = require('csurf');
const helmet = require('helmet');
const { enterInfo, countSigners, getSignature, listOfSigners} = require('./db');
const { toHash, toCompare } = require('./encode');


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
app.use(
    (req, res, next) => {
        if (!req.session.id) {
            if(req.url != '/petition') {
                return res.redirect('/petition');
            } else {
                return next();
            }
        }
        return next();
    }
);



// let comparing = () => {
//     toHash('okay').then( result => toCompare('okay', result)
//     ).then( result => console.log(result)
//     );
// };
//
// comparing();

//Routes
// 1
app.get('/', (req, res) => {
    req.session.id ? res.redirect('thanks') : res.redirect('/petition');
});

// 2
app.get('/petition', (req, res) => {
    req.session.id ? res.redirect('thanks') : res.render('petition');
});

// 3
app.get('/thanks', (req, res) => {
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
});

// 4
app.get('/signers', (req, res) => {
    return listOfSigners()
        .then( ({ rows }) => {
            res.render('signers', {signersList: rows});
        }).catch(err => {
            console.error(err);
        });
});

// 5
app.post('/petition', (req, res) => {

    const { firstName, lastName, signature } = req.body;

    if(!firstName || !lastName || !signature){
        res.render('petition', {error: true});
    } else {
        enterInfo(req.body.firstName, req.body.lastName, req.body.signature)
            .then(({ rows }) => {
                req.session.id = rows[0].id;
                res.redirect('/thanks');
            }).catch(() => {
                res.render('petition', {error: true});
            });
    }

});



app.listen(8080, () => console.log(`I'm listening.`));
