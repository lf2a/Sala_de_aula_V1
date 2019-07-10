const express = require('express')
const router = express.Router()
const multer = require('multer')
// const path = require('path')
const mysql = require('mysql')
const fs = require('fs')
var group = require('./../group')
var user = require('./../usuario')
const Rand = require('./../rand')
const Query = require('./../query')

router.get('/home/download/:id_postagem', (req, res) => {
    new Query().query(`SELECT ANEXO, ID_GRUPO_FK FROM POSTAGEM WHERE ID_POSTAGEM='${req.params.id_postagem}'`, (err, results, fiel) => {
        var blob = results[0].ANEXO

        fs.writeFile(`./uploads/sala_de_aula.rar`, blob, (err) => {
            if (err) {
                return console.log(err);
            }

            var isValid
            group.grupo_array.forEach(res => {
                if (results[0].ID_GRUPO_FK === res) {
                    isValid = true
                }
            })

            if (isValid) {
                res.download('./uploads/sala_de_aula.rar')
            } else {
                res.redirect('/404')
            }
        });
    })
});

router.get('/home/postagem/:id_postagem', (req, res) => {

    /* sql para trazer as info da postagem e seus comentarios (descontinuado)
    
        Esse codigo nao irá trazer nada mesmo que as info da postagem estejam ok.
        Ele irá gerar um erro dizendo que 'results[0].AUTOR_ID não está definido' (linha: 53)
    
    `SELECT POSTAGEM.*, COMENTARIO.* FROM POSTAGEM INNER JOIN COMENTARIO 
        ON POSTAGEM.ID_POSTAGEM = COMENTARIO.ID_POSTAGEM_FK
            WHERE POSTAGEM.ID_POSTAGEM = '${req.params.id_postagem}'`
    */

    new Query().query(`SELECT ID_POSTAGEM, TITULO, DATA_POSTAGEM, AUTOR, CONTEUDO, ID_GRUPO_FK, AUTOR_ID, NOME_ANEXO FROM POSTAGEM WHERE POSTAGEM.ID_POSTAGEM = '${req.params.id_postagem}'`, (error, results, fields) => {
        if (error) {
            console.log('mysql erro: ' + error.code);

            var erro
            if (error.code == 'ER_NO_REFERENCED_ROW') {
                erro = 'O usuario não existe'
            }

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
                    excluir_post_tag: 'Fim',
                    excluir_post_link: ''
                }

                if (results[0].AUTOR_ID == user.id) {
                    isAutor.excluir_post_tag = 'Excluir'
                    isAutor.excluir_post_link = '/home/excluir/postagem/' + results[0].ID_POSTAGEM
                }

                var MarkdownIt = require('markdown-it'),
                    md = new MarkdownIt();

                var rt = md.render(results[0].CONTEUDO);

                var anexo = {
                    anexo: '',
                    anexo_link: ''
                }
                try {
                    let nome = String(results[0].NOME_ANEXO)
                    if (nome === 'sala_de_aula.rar') {
                        anexo.anexo = 'Baixar Anexo'
                        anexo.anexo_link = '/home/download/' + results[0].ID_POSTAGEM
                    } else {
                        anexo.anexo = 'Sem anexo'
                        anexo.anexo_link = '#'
                    }
                } catch (err) {
                    anexo.anexo = 'Sem anexo'
                    anexo.anexo_link = '#'
                }

                res.render('pages/postagem', {
                    results: results,
                    isAutor: isAutor,
                    user: user,
                    grupo_id: group.id_grupo,
                    nome_grupo: group.nome_grupo,
                    renderHtml: rt,
                    anexo: anexo
                })
            } else {
                res.redirect('/404')
            }
        }
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // cb(null, `${file.fieldname}-${Date.now()}.${path.extname(file.originalname)}`);
        cb(null, `temp.rar`);
    }
});

const upload = multer({
    storage
});

router.post('/home/criar/postagem/:grupo_id', upload.single('anexo'), (req, res) => {

    var connection = mysql.createConnection({
        host: 'remotemysql.com',
        user: 'CZ7KZmc3yk',
        password: 'cZET8iPiZ7',
        database: 'CZ7KZmc3yk',
        debug: false,
    });

    connection.connect();

    let hora = 10
    let minuto = 10
    let segundo = 10
    let year = String(new Date().toISOString().slice(0, 4));
    let month = String(new Date().toISOString().slice(5, 7));
    let day = String(new Date().toISOString().slice(8, 10));
    var data_post = year + month + day + hora + minuto + segundo

    var dados = {
        ID_POSTAGEM: new Rand().rand(),
        TITULO: req.body.titulo_postagem,
        DATA_POSTAGEM: data_post,
        AUTOR: user.nome,
        CONTEUDO: req.body.conteudo_postagem,
        ID_GRUPO_FK: req.params.grupo_id,
        AUTOR_ID: user.id,
        NOME_ANEXO: 'sala_de_aula.rar',
        ANEXO: fs.readFileSync('./uploads/temp.rar')
    }

    connection.query('INSERT INTO POSTAGEM SET ?', dados, (error, results, fields) => {
        if (error) {
            console.log('mysql erro: ' + error.code);

            var erro
            if (error.code == 'ER_DUP_ENTRY') {
                erro = 'Id duplicado tente novamente'
            }

            res.render('pages/erro', {
                erro_name: erro,
                erro: error.code,
                link: '/home'
            })

        } else {
            res.redirect('/home/postagens/' + req.params.grupo_id)
        }
    })

    connection.end()
})

router.get('/home/excluir/postagem/:id_postagem', (req, res) => {
    new Query().query(`SELECT AUTOR_ID FROM \`POSTAGEM\` WHERE ID_POSTAGEM='${req.params.id_postagem}'`, (error, results, fields) => {
        if (results[0].AUTOR_ID === user.id) {
            new Query().query(`DELETE FROM POSTAGEM WHERE ID_POSTAGEM='${req.params.id_postagem}'`, function (error, results, fields) {
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
    })

})

module.exports = router