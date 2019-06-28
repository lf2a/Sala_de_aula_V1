const express = require('express')
const router = express.Router()
const ibmdb = require('ibm_db')

router.get('/postagens', (req, res) => {

    ibmdb.open('DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-03.services.dal.bluemix.net;UID=swn20753;PWD=7@6hs0c6fsd3dqwx;PORT=50000;PROTOCOL=TCPIP', (err, conn) => {
        if (err) {
            return console.log(err)
        }
        conn.query('select * from SWN20753.POSTAGENS', (err, data) => {
            if (err) {
                console.log({
                    erro: err
                })
            } else {
                console.log(data)
                res.send(data)
            }
        })
        conn.close(() => {
            console.log('conexao com o ibmdb encerrada')
        })
    })

    // res.json({
    //     titulo: 'primeiro post',
    //     conteudo: 'conteudo qualquer',
    //     autor: 'luiz filipy'
    // })
})

router.get('/postagens/nova', (req, res) => {
    
    /* modelo
    http://localhost:3003/api/postagens/nova?titulo=meu%20post&conteudo=conteudo%20exemplo&autor=luiz%20filipy
    */
    
    ibmdb.open('DATABASE=BLUDB;HOSTNAME=dashdb-txn-sbox-yp-dal09-03.services.dal.bluemix.net;UID=swn20753;PWD=7@6hs0c6fsd3dqwx;PORT=50000;PROTOCOL=TCPIP', (err, conn) => {
        if (err) {
            console.log({
                erro: err,
                mensagem: 'conexão falhou'
            })
        }
        conn.query(`INSERT INTO SWN20753.POSTAGENS (TITULO, CONTEUDO, AUTOR) VALUES('${req.query.titulo}','${req.query.conteudo}','${req.query.autor}')`, (err, data) => {
            if (err) {
                console.log({
                    erro: err,
                    mensagem: 'query insert falhou'
                })
            } else {
                console.log(data)
                res.send(data)
            }
            conn.close(() => {
                console.log('conexão encerrada')
            })
        })
    })
})

module.exports = router