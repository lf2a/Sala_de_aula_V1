const express = require('express')
const router = express.Router()
const user = require('./../usuario')
const Query = require('./../query')

router.post('/home/adicionar/professor', (req, res) => {
    if (Boolean(user.isAdmin)) {
        new Query().query(`UPDATE USUARIO SET ISPROFESSOR='sim' WHERE USUARIO.ID_USUARIO='${req.body.id_professor}'`, (error, results, fields) => {
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
                res.redirect('/home')
            }
        });
    } else {
        res.redirect('/401')
    }
});

router.post('/home/remover/professor', (req, res) => {
    if (Boolean(user.isAdmin)) {
        new Query().query(`UPDATE USUARIO SET ISPROFESSOR='' WHERE USUARIO.ID_USUARIO='${req.body.id_professor}'`, (error, results, fields) => {
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
                res.redirect('/home')
            }
        });
    } else {
        res.redirect('/401')
    }
});

module.exports = router