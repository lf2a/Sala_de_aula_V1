const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const db_config = require('./../db_config')
const Rand = require('./../rand')

router.post('/signup', (req, res) => {
    var connection = mysql.createConnection({
        host: db_config.con[0],
        user: db_config.con[1],
        password: db_config.con[2],
        database: db_config.con[3]
    });

    connection.connect();

    const r = new Rand()

    let id_usuario = new String()
    if (req.body.id_usuario === 'rand') {
        id_usuario = r.rand()
    } else {
        id_usuario = req.body.id_usuario
    }

    let senha_usuario = new String()
    if (req.body.senha_usuario === 'rand') {
        senha_usuario = r.rand()
    } else {
        senha_usuario = req.body.senha_usuario
    }

    connection.query(`INSERT INTO USUARIO (\`ID_USUARIO\`, \`NOME\`, \`EMAIL\`, \`SENHA\`, \`ISADMIN\`, \`ISPROFESSOR\`) VALUES ('${id_usuario}', '${req.body.nome_usuario}', '${req.body.email_usuario}', '${senha_usuario}', '', '')`, (error, results, fields) => {
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

    connection.end();
});

module.exports = router