const express = require('express')
const router = express.Router()
const mysql = require('mysql')
var group = require('./../group')
var user = require('./../usuario')
const db_config = require('./../db_config')


router.get('/home/adicionar/estudante/', (req, res) => {
    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect();
    if (Boolean(user.isProfessor)) {
        connection.query(`INSERT INTO INTEGRANTE(\`ID_USUARIO_FK\`, \`ID_GRUPO_FK\`, \`IS_SUPER\`) VALUES ('${req.query.id_usuario}', '${group.id_grupo}', '')`, (error, results, fields) => {
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
    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect();
    if (Boolean(user.isProfessor)) {
        connection.query(`DELETE FROM INTEGRANTE WHERE ID_USUARIO_FK='${req.body.id_usuario}' and ID_GRUPO_FK='${group.id_grupo}'`, (error, results, fields) => {
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