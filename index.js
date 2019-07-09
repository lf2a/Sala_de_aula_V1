const Rand = require('./rand')

const express = require('express')
const session = require('express-session')
const body_parser = require('body-parser')

const app = express()

app.set('view engine', 'ejs');

app.use(session({
    secret: new Rand().rand(),
    resave: true,
    saveUninitialized: true
}));

app.use(body_parser.json())
app.use(body_parser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.render('pages/index');
})

const rotas = require('./rotas')

app.use('/', rotas)

app.use(express.static(__dirname + '/views'))

app.listen(process.env.PORT || 3000, () => {
    console.log('servidor em execução');
});