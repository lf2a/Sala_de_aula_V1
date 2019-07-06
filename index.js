var fs = require('fs')
var https = require('https')
const Rand = require('./rand')

const express = require('express')
const session = require('express-session')
const body_parser = require('body-parser')

const app = express()

app.set('view engine', 'ejs');

const r = new Rand()

app.use(session({
    secret: r.rand(),
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

const porta = 3000

/**
 * caso for usar a porta 80 é
 * preciso levantar o server como root pra evitar o erro
 * "Error: listen EACCES: permission denied 0.0.0.0:80"
 */

/** 
 * caso tenha o apache2 rodando na porta 80
 * sudo service apache2 stop
 */

https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app)
    .listen(porta, () => {
        console.log(`https://localhost:${porta}`)
    })