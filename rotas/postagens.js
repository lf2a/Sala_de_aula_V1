const express = require('express')
const router = express.Router()
const mysql = require('mysql')
var group = require('./../group')
var user = require('./../usuario')
const db_config = require('./../db_config')
var limit = require('./../limit')

router.get('/home/postagens/:id_grupo', (req, res) => {
    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect();

    var isValid = false

    group.grupo_array.forEach(res => {
        if (res === req.params.id_grupo) {
            isValid = true
        }
    })

    if (req.query.limit) {
        limit.limit_posts += Number(req.query.limit)
    } else {
        Number(limit.limit_posts = 5)
    }

    if (isValid) {
        connection.query(`SELECT * FROM POSTAGEM WHERE ID_GRUPO_FK='${req.params.id_grupo}' ORDER BY DATA_POSTAGEM DESC LIMIT ${limit.limit_posts}`, (error, results, fields) => {
            if (error) {
                console.log('mysql erro: ' + error.code);

                var erro

                res.render('pages/erro', {
                    erro_name: erro,
                    erro: error.code,
                    link: '/home'
                })

            } else {

                const isProfessor = {
                    adicionar_usuario_tag: '',
                    adicionar_usuario_link: '',
                    remover_usuario_tag: '',
                    remover_usuario_link: ''
                }
                if (Boolean(user.isProfessor)) {
                    isProfessor.adicionar_usuario_tag = 'Adicionar Usuario'
                    isProfessor.remover_usuario_tag = 'Remover Usuario'
                    isProfessor.adicionar_usuario_link = '/home/adicionar/estudante/'
                    isProfessor.remover_usuario_link = '/home/remover/estudante/'
                }

                group.id_grupo = req.params.id_grupo

                res.render('pages/postagens', {
                    results: results,
                    isProfessor: isProfessor,
                    grupoid: req.params.id_grupo,
                    user_id: user.id
                })
            }
        });
    } else {
        res.redirect('/404')
    }


    connection.end();
});

module.exports = router