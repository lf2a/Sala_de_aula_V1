const express = require('express')
const router = express.Router()

router.get('/postagens', (req, res) => {
    res.json({
        titulo: 'primeiro post',
        conteudo: 'conteudo qualquer',
        autor: 'luiz filipy'
    })
})

module.exports = router