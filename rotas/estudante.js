const express = require('express')
const router = express.Router()
var group = require('./../group')
var user = require('./../usuario')
const Query = require('./../query')


router.get('/home/adicionar/estudante/', (req, res) => {
    if (Boolean(user.isProfessor)) {
        new Query().query(`INSERT INTO INTEGRANTE(\`ID_USUARIO_FK\`, \`ID_GRUPO_FK\`, \`IS_SUPER\`) VALUES ('${req.query.id_usuario}', '${group.id_grupo}', '')`, (error, results, fields) => {
            if (error) {
                console.log('mysql erro: ' + error.code);

                var erro
                if (error.code == 'ER_NO_REFERENCED_ROW') {
                    erro = 'O usuario não existe'
                }

                res.render('pages/erro', {
                    erro_name: erro,
                    erro: error.code,
                    link: '/home/postagens/' + group.id_grupo
                })

            } else {
                res.redirect('/home')
            }
        });
    } else {
        res.redirect('/404')
    }
});

router.post('/home/remover/estudante/', (req, res) => {
    if (Boolean(user.isProfessor)) {
        new Query().query(`DELETE FROM INTEGRANTE WHERE ID_USUARIO_FK='${req.body.id_usuario}' and ID_GRUPO_FK='${group.id_grupo}'`, (error, results, fields) => {
            if (error) {
                console.log('mysql erro: ' + error.code);

                var erro

                res.render('pages/erro', {
                    erro_name: error.code,
                    erro: erro,
                    link: '/home'
                })
            } else {
                res.redirect('/home')
            }
        });
    } else {
        res.redirect('/404')
    }
});

module.exports = router