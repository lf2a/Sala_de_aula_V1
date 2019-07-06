const mysql = require('mysql')
const db_config = require('./db_config')

class Query {
    query(q, callback) {
        var connection = mysql.createConnection({
            host: db_config.con[0],
            user: db_config.con[1],
            password: db_config.con[2],
            database: db_config.con[3]
        });

        connection.connect();

        connection.query(q, (error, results, fields) => {
            if (error) {
                console.log(error.code + ' - ' + error.message)
            }
            return callback(error, results, fields)
        });

        connection.end();
    }
}

// const Query = require('./query')
// const q = new Query()

// let b = new Object()
// let c = new Object()

// q.query('SELECT * FROM `GRUPO`', (error, results, fields) => {
//     test(results, false, false)
// })

// q.query('SELECT * FROM `USUARIO`', (error, results, fields) => {
//     test(false, results, true)
// })

// function test(p1, p2, p3) {
//     if (p1) {
//         b = p1
//     }
//     if (p2) {
//         c = p2
//     }
//     if (p3) {
//         let show = {
//             grupo: b,
//             usuario: c
//         }
        
//     }
// }

module.exports = Query