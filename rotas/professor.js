const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const user = require('./../usuario')
const db_config = require('./../db_config')

router.post('/home/adicionar/professor', (req, res) => {
    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect();
    if (Boolean(user.isAdmin)) {
        connection.query(`UPDATE USUARIO SET ISPROFESSOR='sim' WHERE USUARIO.ID_USUARIO='${req.body.id_professor}'`, (error, results, fields) => {
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
                res.redirect('/home')
            }
        });
    } else {
        res.redirect('/401')
    }
});

router.post('/home/remover/professor', (req, res) => {
    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect();
    if (Boolean(user.isAdmin)) {
        connection.query(`UPDATE USUARIO SET ISPROFESSOR='' WHERE USUARIO.ID_USUARIO='${req.body.id_professor}'`, (error, results, fields) => {
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
                res.redirect('/home')
            }
        });
    } else {
        res.redirect('/401')
    }
});

module.exports = router