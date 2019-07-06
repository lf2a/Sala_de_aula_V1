const express = require('express')
const router = express.Router()
const mysql = require('mysql')
var group = require('./../group')
var user = require('./../usuario')
const db_config = require('./../db_config')
const Rand = require('./../rand')
const Query = require('./../query')

router.get('/home/postagem/:id_postagem', (req, res) => {

    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect();

    /* sql para trazer as info da postagem e seus comentarios (descontinuado)
    
        Esse codigo nao irá trazer nada mesmo que as info da postagem estajam ok.
        Ele irá gerar um erro dizendo que 'results[0].AUTOR_ID não está definido' (linha: 36)
    
    `SELECT POSTAGEM.*, COMENTARIO.* FROM POSTAGEM INNER JOIN COMENTARIO 
        ON POSTAGEM.ID_POSTAGEM = COMENTARIO.ID_POSTAGEM_FK
            WHERE POSTAGEM.ID_POSTAGEM = '${req.params.id_postagem}'`
    */

    connection.query(`SELECT * FROM POSTAGEM WHERE POSTAGEM.ID_POSTAGEM = '${req.params.id_postagem}'`, (error, results, fields) => {
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

            var isValid
            group.grupo_array.forEach(res => {
                if (results[0].ID_GRUPO_FK === res) {
                    isValid = true
                }
            })

            if (isValid) {

                const isAutor = {
                    excluir_post_tag: '',
                    excluir_post_link: ''
                }

                if (results[0].AUTOR_ID == user.id) {
                    isAutor.excluir_post_tag = 'Excluir Publicação'
                    isAutor.excluir_post_link = '/home/excluir/postagem/' + results[0].ID_POSTAGEM
                }

                res.render('pages/postagem', {
                    results: results,
                    isAutor: isAutor,
                    user: user,
                    grupo_id: group.id_grupo
                })
            } else {
                res.redirect('/404')
            }
        }
    });

    connection.end();
});

router.post('/home/criar/postagem/:grupo_id', (req, res) => {

    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect();

    // var datetime = new Date();
    let hora = 10 //datetime.toISOString().slice(11, 13)
    let minuto = 10 //datetime.toISOString().slice(14, 16)
    let segundo = 10 //datetime.toISOString().slice(17, 19)
    let year = String(new Date().toISOString().slice(0, 4));
    let month = String(new Date().toISOString().slice(5, 7));
    let day = String(new Date().toISOString().slice(8, 10));
    var data_post = year + month + day + hora + minuto + segundo

    const r = new Rand()

    connection.query(`INSERT INTO POSTAGEM (\`TITULO\`, \`CONTEUDO\`, \`AUTOR\`, \`DATA_POSTAGEM\`, \`ID_GRUPO_FK\`, \`ID_POSTAGEM\`, \`AUTOR_ID\`) VALUES ('${req.body.titulo_postagem}', '${req.body.conteudo_postagem}', '${user.nome}', '${data_post}', '${req.params.grupo_id}', '${r.rand()}', '${user.id}')`, function (error, results, fields) {
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
            res.redirect('/home/postagens/' + req.params.grupo_id)
        }
    });

    connection.end();
})

router.get('/home/excluir/postagem/:id_postagem', (req, res) => {
    new Query().query(`SELECT AUTOR_ID FROM \`POSTAGEM\` WHERE ID_POSTAGEM='${req.params.id_postagem}'`, (error, results, fields) => {
        var connection = mysql.createConnection({
            host: db_config.con[0],
            user: db_config.con[1],
            password: db_config.con[2],
            database: db_config.con[3]
        });

        connection.connect();

        if (results[0].AUTOR_ID === user.id) {
            connection.query(`DELETE FROM POSTAGEM WHERE ID_POSTAGEM='${req.params.id_postagem}'`, function (error, results, fields) {
                if (error) {
                    console.log('mysql erro: ' + error.code);

                    var erro

                    res.render('pages/erro', {
                        erro_name: erro,
                        erro: error.code,
                        link: '/home'
                    })

                } else {
                    const group = require('./../group')
                    res.redirect('/home/postagens/' + group.id_grupo)
                }
            });
        } else {
            res.redirect('/404')
        }

        connection.end();
    })

})

module.exports = router