const mysql = require('mysql')

class Query {
    query(q, callback) {

        let conn = mysql.createConnection({
            host: 'remotemysql.com',
            user: 'CZ7KZmc3yk',
            password: 'cZET8iPiZ7',
            database: 'CZ7KZmc3yk'
        });

        conn.connect();
        conn.query(q, (error, results, fields) => {
            if (error) {
                console.log(error.code + ' - ' + error.message)
            }
            return callback(error, results, fields)
        });
        conn.end();
    }
}

module.exports = Query