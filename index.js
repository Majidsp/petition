const express = require('express');
const app = express();
const hb = require('express-handlebars');
const cookieParser = require('cookie-parser');
const spicedPg = require('spiced-pg');
let db = spicedPg('postgres:postgres:12345@localhost:5432/petition');

app.use(
    cookieParser()
);


app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(express.static('./public'));
app.use(express.urlencoded( { extended: false} ));



//Routes
// 1
app.get('/', (req, res) => {
    if(req.cookies.signed) {
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
    return db.query(
        `SELECT COUNT(*) AS NUMBEROFSIGNERS FROM petition;`
    ).then((result) => {
        res.render('thanks', {signers: result.rows[0].numberofsigners});
    }).catch(err => {
        console.error(err);
    });
});

// 4
app.get('/signers', (req, res) => {
    res.render('thanks');
});

// 5
app.post('/petition', (req, res) => {

    const { firstName, lastName, signature } = req.body;

    if(!firstName || !lastName || !signature){
        res.render('petition', {error: true});
    } else {
        db.query(
            `INSERT INTO petition (firstname, lastname, signature) VALUES ($1, $2, $3)`,
            [req.body.firstName, req.body.lastName, req.body.signature]
        ).then(() => {
            res.cookie('signed', 'true');
            res.redirect('/thanks');
        }).catch(() => {
            res.render('petition', {error: true});
        });
    }

});



app.listen(8080, () => console.log(`I'm listening.`));
