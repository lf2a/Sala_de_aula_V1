const express = require('express')
const router = express.Router()
var user = require('./../usuario')
const Query = require('./../query')

router.get('/delete', (req, res) => {
    new Query().query(`DELETE FROM USUARIO WHERE ID_USUARIO='${user.id}' `, (error, results, fields) => {
        if (error) {
            console.log('mysql erro: ' + error.code);

            var erro
            if (error.code == 'ER_NO_REFERENCED_ROW') {
                erro = 'O usuario não existe'
            }

            res.render('pages/erro', {
                erro_name: erro,
                erro: error.code,
                link: '/home'
            })
        } else {
            res.redirect('/')
        }
    });
})

module.exports = router