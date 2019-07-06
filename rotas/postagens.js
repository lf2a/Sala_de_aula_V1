const express = require('express')
const router = express.Router()
var group = require('./../group')
var user = require('./../usuario')
var limit = require('./../limit')
const Query = require('./../query')

router.get('/home/postagens/:id_grupo', (req, res) => {
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
        new Query().query(`SELECT * FROM POSTAGEM WHERE ID_GRUPO_FK='${req.params.id_grupo}' ORDER BY DATA_POSTAGEM DESC LIMIT ${limit.limit_posts}`, (error, results, fields) => {
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

                let array_posts = new Array()
                array_posts = []
                results.forEach(res => {
                    array_posts.push(res.ID_POSTAGEM)
                });

                let mostrar_mais = new String()
                try {
                    console.log(results[0].ID_POSTAGEM)
                    mostrar_mais = 'mostrar mais'
                    if (array_posts.length < 5) {
                        mostrar_mais = ''
                    }
                } catch (err) {
                    mostrar_mais = ''
                }

                res.render('pages/postagens', {
                    results: results,
                    isProfessor: isProfessor,
                    grupoid: req.params.id_grupo,
                    user_id: user.id,
                    mostrar_mais: mostrar_mais
                })
            }
        });
    } else {
        res.redirect('/404')
    }
});

module.exports = router