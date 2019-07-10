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
        Number(limit.limit_posts = 10)
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

                // let mostrar_mais = new String()
                // try {
                //     console.log(results[0].ID_POSTAGEM)
                //     mostrar_mais = 'mostrar mais'
                //     if (array_posts.length < 5) {
                //         mostrar_mais = ''
                //     }
                // } catch (err) {
                //     mostrar_mais = ''
                // }

                new Query().query(`SELECT * FROM GRUPO WHERE ID_GRUPO='${req.params.id_grupo}'`, (error, resul, fields) => {
                    new Query().query(`SELECT COUNT(ID_POSTAGEM) AS POST_COUNT FROM POSTAGEM WHERE ID_GRUPO_FK = '${req.params.id_grupo}'`, (error, resu, fields) => {
                        let mostrar_mais = new String()
                        let mostrar_link = new String()

                        try {
                            mostrar_mais = 'mostrar mais'
                            mostra_link = `/home/postagens/${req.params.id_grupo}?limit=10`
                            if (resu[0].POST_COUNT <= 10 || limit.limit_posts >= resu[0].POST_COUNT) {
                                mostrar_mais = 'Está tudo bem.'
                                mostra_link = '#'
                            }
                            if (Number(resu[0].POST_COUNT) == 0) {
                                mostrar_mais = 'Tudo vazio por aqui :)'
                                mostra_link = '#'
                            }
                        } catch (error) {
                            mostrar_mais = ''
                        }

                        group.nome_grupo = resul[0].NOME

                        res.render('pages/postagens', {
                            results: results,
                            resul: resul,
                            isProfessor: isProfessor,
                            grupoid: req.params.id_grupo,
                            user_id: user.id,
                            mostrar_mais: mostrar_mais,
                            mostrar_link: mostrar_link,
                            user: user
                        })
                    })
                })

                // res.render('pages/postagens', {
                //     results: results,
                //     isProfessor: isProfessor,
                //     grupoid: req.params.id_grupo,
                //     user_id: user.id,
                //     mostrar_mais: mostrar_mais,
                //     user: user
                // })
            }
        });
    } else {
        res.redirect('/404')
    }
});

module.exports = router