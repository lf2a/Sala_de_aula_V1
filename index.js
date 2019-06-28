const express = require('express')
const body_parser = require('body-parser')

const app = express()

app.use(body_parser.json())
app.use(body_parser.urlencoded({
    extended: false
}))

/* testando get */
app.get('/', (req, res) => {
    res.send('funcionando')
})

const rotas = require('./rotas')
app.use('/api', rotas)

app.use(express.static(__dirname + '/cliente'))

const porta = 3003 // porta padrao deve ser 3001
app.listen(porta, () => {
    console.log('Servidor em excução (localhost:', porta, ')')
})