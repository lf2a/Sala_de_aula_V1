const express = require('express')
const router = express.Router()
const Rand = require('./../rand')
const Query = require('./../query')

router.post('/signup', (req, res) => {
    let id_usuario = new String()
    if (req.body.id_usuario === 'rand') {
        id_usuario = new Rand().rand()
    } else {
        id_usuario = req.body.id_usuario
    }

    let senha_usuario = new String()
    if (req.body.senha_usuario === 'rand') {
        senha_usuario = new Rand().rand()
    } else {
        senha_usuario = req.body.senha_usuario
    }

    new Query().query(`INSERT INTO USUARIO (\`ID_USUARIO\`, \`NOME\`, \`EMAIL\`, \`SENHA\`, \`ISADMIN\`, \`ISPROFESSOR\`) VALUES ('${id_usuario}', '${req.body.nome_usuario}', '${req.body.email_usuario}', '${senha_usuario}', '', '')`, (error, results, fields) => {
        if (error) {
            console.log('mysql erro: ' + error.code);

            var erro
            if (error.code == 'ER_DUP_ENTRY') {
                erro = `Este id (${req.body.id_usuario}) já está cadastrado`
            }

            res.render('pages/erro', {
                erro_name: erro,
                erro: error.code,
                link: '/'
            })

        } else {
            let signup = {
                id: id_usuario,
                nome: req.body.nome_usuario,
                email: req.body.email_usuario,
                senha: senha_usuario
            }
            res.render('pages/info_signup', {
                status: signup
            })
        }
    });
});

module.exports = router