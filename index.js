const express = require('express');
const app = express();
const hb = require('express-handlebars');
// const cookieParser = require('cookie-parser');
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(express.static('./public'));


app.get('/', (req, res) => {
    res.render('petition', {
        title: 'Petition Page!!!!!!!!!',
        layout: 'main'
    });
});

app.get('/thanks', (req, res) => {
    res.render('thanks', {
        title: 'Thanks Page!!!!!!!!!',
        layout: 'main'
    });
});

app.get('/signers', (req, res) => {
    res.render('thanks', {
        title: 'Signers Page!!!!!!!!!',
        layout: 'main'
    });
});






app.listen(8080, () => console.log(`I'm listening.`));
