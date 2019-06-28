const express = require('express')
const router = express.Router()

router.get('/comentarios/:postid', (req, res) => {
    res.json({
        conteudo: 'conteudo qualquer comentario',
        autor: 'luiz filipy'
    })
})

module.exports = router