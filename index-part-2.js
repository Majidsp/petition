const express = require('express');
const app = express();
const hb = require('express-handlebars');
const cookieSession = require('cookie-session');
const spicedPg = require('spiced-pg');
let db = spicedPg('postgres:postgres:12345@localhost:5432/petition');


app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));

app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(express.static('./public'));
app.use(express.urlencoded({extended: false}));


//Routes
// 1
app.get('/', (req, res) => {
    if(req.session.id) {
        res.redirect('thanks');
    } else {
        res.redirect('/petition');
    }
});

// 2
app.get('/petition', (req, res) => {
    res.render('petition');
});

// 3
app.get('/thanks', (req, res) => {
    let id = req.session.id;
    let numberOfSigners = 0;
    return db.query(
        `SELECT COUNT(*) AS NUMBEROFSIGNERS FROM petition;`
    ).then(({ rows }) => {
        numberOfSigners = rows[0].numberofsigners;
        return db.query(
            `SELECT SIGNATURE FROM petition WHERE id = $1;`,
            [id]
        );
    }).then( ({ rows }) => {
        res.render('thanks', {signers: numberOfSigners, signature: rows[0].signature});
    }).catch(err => {
        console.error(err);
    });
});

// 4
app.get('/signers', (req, res) => {
    return db.query(
        `SELECT FIRSTNAME, LASTNAME FROM petition;`
    ).then( ({ rows }) => {
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
        db.query(
            `INSERT INTO petition (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING id`,
            [req.body.firstName, req.body.lastName, req.body.signature]
        ).then(({ rows }) => {
            req.session.id = rows[0].id;
            res.redirect('/thanks');
        }).catch(() => {
            res.render('petition', {error: true});
        });
    }

});



app.listen(8080, () => console.log(`I'm listening.`));
