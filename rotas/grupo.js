const express = require('express')
const router = express.Router()
const mysql = require('mysql')
var group = require('./../group')
var user = require('./../usuario')
const db_config = require('./../db_config')
const Rand = require('./../rand')

router.post('/home/criar/grupo', (req, res) => {
    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    const r = new Rand()

    let id_grupo = new String()
    // if (req.body.id_grupo === 'rand') {
    id_grupo = r.rand()
    // } else {
    //     id_grupo = req.body.id_grupo
    // }

    connection.connect();
    if (Boolean(user.isProfessor)) {
        connection.query(`INSERT INTO GRUPO(\`ID_GRUPO\`, \`NOME\`) VALUES ('${id_grupo}','${req.body.nome_grupo}')`, (error, results, fields) => {
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

                group.id_grupo = id_grupo
                res.redirect(`/home/adicionar/estudante?id_usuario=${user.id}`)
            }
        });
    } else {
        res.redirect('/404')
    }

    connection.end();
});

router.get('/home/info/grupo/:id_grupo', (req, res) => {
    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect();

    connection.query(`SELECT USUARIO.ID_USUARIO, USUARIO.NOME, USUARIO.EMAIL, INTEGRANTE.ID_GRUPO_FK 
    FROM USUARIO INNER JOIN INTEGRANTE ON USUARIO.ID_USUARIO = INTEGRANTE.ID_USUARIO_FK
        WHERE INTEGRANTE.ID_GRUPO_FK = '${req.params.id_grupo}'`, (error, results, fields) => {
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

    connection.end();
})

router.get('/home/excluir/grupo/:id_grupo', (req, res) => {
    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect();
    if (Boolean(user.isProfessor)) {
        connection.query(`DELETE FROM GRUPO WHERE ID_GRUPO='${req.params.id_grupo}'`, (error, results, fields) => {
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
                res.redirect('/home/')
            }
        });
    } else {
        res.redirect('/404')
    }
    connection.end();
})

module.exports = router