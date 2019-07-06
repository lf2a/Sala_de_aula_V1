const express = require('express')
const router = express.Router()
var group = require('./../group')
var user = require('./../usuario')
const Rand = require('./../rand')
const Query = require('./../query')

router.post('/home/criar/grupo', (req, res) => {

    let id_grupo = new String()
    id_grupo = new Rand().rand()

    if (Boolean(user.isProfessor)) {
        new Query().query(`INSERT INTO GRUPO(\`ID_GRUPO\`, \`NOME\`) VALUES ('${id_grupo}','${req.body.nome_grupo}')`, (error, results, fields) => {
            if (error) {
                console.log('mysql erro: ' + error.code);

                var erro
                if (error.code == 'ER_DUP_ENTRY') {
                    erro = `Um grupo com este id (${id_grupo}) já existe`
                }

                res.render('pages/erro', {
                    erro_name: erro,
                    erro: error.code,
                    link: '/home'
                })

            } else {

                group.id_grupo = id_grupo
                res.redirect(`/home/adicionar/estudante?id_usuario=${user.id}`)
            }
        });
    } else {
        res.redirect('/404')
    }
});

router.get('/home/info/grupo/:id_grupo', (req, res) => {

    new Query().query(`SELECT USUARIO.ID_USUARIO, USUARIO.NOME, USUARIO.EMAIL, INTEGRANTE.ID_GRUPO_FK 
    FROM USUARIO INNER JOIN INTEGRANTE ON USUARIO.ID_USUARIO = INTEGRANTE.ID_USUARIO_FK
        WHERE INTEGRANTE.ID_GRUPO_FK = '${req.params.id_grupo}'`, (error, results, fields) => {
        if (error) {
            console.log('mysql erro: ' + error.code);

            var erro

            res.render('pages/erro', {
                erro_name: erro,
                erro: error.code,
                link: '/home'
            })
        } else {

            const grupo_professor = {
                excluir_grupo_tag: '',
                excluir_grupo_link: ''
            }

            if (Boolean(user.isProfessor)) {
                grupo_professor.excluir_grupo_tag = 'Excluir Grupo'
                grupo_professor.excluir_grupo_link = '/home/excluir/grupo/' + req.params.id_grupo
            }

            res.render('pages/info_grupo', {
                results: results,
                grupo_professor: grupo_professor,
                grupo_id: req.params.id_grupo
            })
        }
    });
})

router.get('/home/excluir/grupo/:id_grupo', (req, res) => {

    if (Boolean(user.isProfessor)) {
        new Query().query(`DELETE FROM GRUPO WHERE ID_GRUPO='${req.params.id_grupo}'`, (error, results, fields) => {
            if (error) {
                console.log('mysql erro: ' + error.code);

                var erro

                res.render('pages/erro', {
                    erro_name: erro,
                    erro: error.code,
                    link: '/home'
                })
            } else {
                res.redirect('/home/')
            }
        });
    } else {
        res.redirect('/404')
    }
})

module.exports = router