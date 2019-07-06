const express = require('express')
const router = express.Router()
const mysql = require('mysql')
var user = require('./../usuario')
const db_config = require('./../db_config')

router.get('/delete', (req, res) => {

    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect()

    connection.query(`DELETE FROM USUARIO WHERE ID_USUARIO='${user.id}' `, (error, results, fields) => {
        if (error) {
            console.log('mysql erro: ' + error.code);

            var erro
            // if (error.code == 'ER_DUP_ENTRY') {
            //     erro = 'O usuario Já está incluso no grupo'
            // } else if (error.code == 'ER_NO_REFERENCED_ROW') {
            //     erro = 'O usuario não existe'
            // }

            res.render('pages/erro', {
                erro_name: erro,
                erro: error.code,
                link: '/home'
            })
        } else {
            res.redirect('/')
        }
    });

    connection.end()
})

module.exports = router