const express = require('express')
const router = express.Router()
const user = require('./../usuario')
var group = require('./../group')
var limit = require('./../limit')
const Query = require('./../query')

router.get('/home', (req, res) => {

    if (req.query.limit) {
        limit.limit_group += Number(req.query.limit)
    } else {
        Number(limit.limit_group = 10)
    }

    new Query().query(`SELECT INTEGRANTE.*, GRUPO.NOME FROM INTEGRANTE INNER JOIN GRUPO ON INTEGRANTE.ID_GRUPO_FK = GRUPO.ID_GRUPO WHERE INTEGRANTE.ID_USUARIO_FK = '${user.id}' LIMIT ${limit.limit_group}`, (error, results, fields) => {
        if (error) {
            console.log('mysql erro: ' + error.code);

            let erro

            res.render('pages/erro', {
                erro_name: erro,
                erro: error.code,
                link: '/home'
            })
        } else {
            try {
                group.id_grupo = results[0].ID_GRUPO
                group.nome_curso = results[0].CURSO_ID_CURSO
            } catch (err) {
                group.id_grupo = ''
                group.nome_curso = ''
            }

            const tag_link = {
                criar_grupo_tag: '',
                criar_grupo_link: '',
                adicionar_professor_tag: '',
                adicionar_professor_link: '',
                remover_professor_tag: '',
                remover_professor_link: ''
            }

            if (Boolean(user.isProfessor)) {
                tag_link.criar_grupo_link = '/home/criar/grupo'
                tag_link.criar_grupo_tag = 'Criar Grupo'
            }

            if (Boolean(user.isAdmin)) {
                tag_link.adicionar_professor_tag = 'Adicionar Professor'
                tag_link.adicionar_professor_link = '/home/adicionar/professor'
                tag_link.remover_professor_tag = 'Remover Professor'
                tag_link.remover_professor_link = '/home/remover/professor'
            }

            group.grupo_array = []
            results.forEach(res => {
                group.grupo_array.push(res.ID_GRUPO_FK)
            });

            new Query().query(`SELECT  COUNT(ID_GRUPO_FK) AS GRUPO_COUNT FROM INTEGRANTE  WHERE ID_USUARIO_FK = '${user.id}'`, (error, resul, fields) => {
                let mostrar_mais = new String()
                let mostrar_link = new String()
                try {
                    mostrar_mais = 'mostrar mais'
                    mostrar_link = '/home?limit=10'

                    if (resul[0].GRUPO_COUNT <= 10 || limit.limit_group >= resul[0].GRUPO_COUNT) {
                        mostrar_mais = 'Está tudo bem.'
                        mostrar_link = '#'
                    }
                    if (Number(resul[0].GRUPO_COUNT) == 0) {
                        mostrar_mais = 'Você não pertence a nenhum grupo'
                        mostrar_link = '#'
                    }
                } catch (error) {
                    mostrar_mais = ''
                }

                res.render('pages/home', {
                    results: results,
                    user: user,
                    tag_link: tag_link,
                    mostrar_mais: mostrar_mais,
                    mostra_link: mostrar_link
                })
            })
        }
    });
});

module.exports = router