const express = require('express')
const router = express.Router()
var user = require('./../usuario')
const Query = require('./../query')

router.post('/login', (req, res) => {
    if (!req.body.id_usuario || !req.body.senha_usuario) {
        res.send('login failed');

    } else {
        new Query().query(`SELECT * FROM USUARIO WHERE ID_USUARIO='${req.body.id_usuario}'`, (error, results, fields) => {
            if (error) {
                console.log('mysql erro: ' + error.code);

                var erro

                res.render('pages/erro', {
                    erro_name: erro,
                    erro: error.code,
                    link: '/home'
                })

            } else {
                var passRequest = req.body.senha_usuario;
                var senha

                try {
                    senha = results[0].SENHA
                } catch (err) {
                    senha = ''
                }

                if (passRequest === senha) {

                    user.nome = results[0].NOME
                    user.id = results[0].ID_USUARIO
                    user.email = results[0].EMAIL
                    user.isProfessor = results[0].ISPROFESSOR
                    user.isAdmin = results[0].ISADMIN

                    req.session.user = results[0].ID_USUARIO
                    req.session.admin = true

                    res.redirect('/home')
                } else {
                    res.render('pages/erro', {
                        erro_name: 'Usuario inválido',
                        erro: 'verifique se seu id e sua senha estão corretos',
                        link: '/'
                    })
                }
            }
        });
    }
});

module.exports = router