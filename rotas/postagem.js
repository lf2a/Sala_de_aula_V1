const express = require('express')
const router = express.Router()
var group = require('./../group')
var user = require('./../usuario')
const Rand = require('./../rand')
const Query = require('./../query')

router.get('/home/postagem/:id_postagem', (req, res) => {

    /* sql para trazer as info da postagem e seus comentarios (descontinuado)
    
        Esse codigo nao irá trazer nada mesmo que as info da postagem estejam ok.
        Ele irá gerar um erro dizendo que 'results[0].AUTOR_ID não está definido' (linha: 53)
    
    `SELECT POSTAGEM.*, COMENTARIO.* FROM POSTAGEM INNER JOIN COMENTARIO 
        ON POSTAGEM.ID_POSTAGEM = COMENTARIO.ID_POSTAGEM_FK
            WHERE POSTAGEM.ID_POSTAGEM = '${req.params.id_postagem}'`
    */

    new Query().query(`SELECT * FROM POSTAGEM WHERE POSTAGEM.ID_POSTAGEM = '${req.params.id_postagem}'`, (error, results, fields) => {
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

                res.render('pages/postagem', {
                    results: results,
                    isAutor: isAutor,
                    user: user,
                    grupo_id: group.id_grupo,
                    nome_grupo: group.nome_grupo,
                    renderHtml: rt
                })
            } else {
                res.redirect('/404')
            }
        }
    });
});

router.post('/home/criar/postagem/:grupo_id', (req, res) => {

    let hora = 10
    let minuto = 10
    let segundo = 10
    let year = String(new Date().toISOString().slice(0, 4));
    let month = String(new Date().toISOString().slice(5, 7));
    let day = String(new Date().toISOString().slice(8, 10));
    var data_post = year + month + day + hora + minuto + segundo

    new Query().query(`INSERT INTO POSTAGEM (\`TITULO\`, \`CONTEUDO\`, \`AUTOR\`, \`DATA_POSTAGEM\`, \`ID_GRUPO_FK\`, \`ID_POSTAGEM\`, \`AUTOR_ID\`) VALUES ('${req.body.titulo_postagem}', '${req.body.conteudo_postagem}', '${user.nome}', '${data_post}', '${req.params.grupo_id}', '${new Rand().rand()}', '${user.id}')`, function (error, results, fields) {
        if (error) {
            console.log('mysql erro: ' + error.code);

            var erro
            if (error.code == 'ER_DUP_ENTRY') {
                erro = 'O usuario Já está incluso no grupo'
            }

            res.render('pages/erro', {
                erro_name: erro,
                erro: error.code,
                link: '/home'
            })

        } else {
            res.redirect('/home/postagens/' + req.params.grupo_id)
        }
    });
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