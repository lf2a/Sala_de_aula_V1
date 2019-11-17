const mysql = require('mysql')

class Query {
    query(q, callback) {

        let conn = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
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
