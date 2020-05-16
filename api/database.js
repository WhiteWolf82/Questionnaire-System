var mysql = require('mysql');
var dbConfig = require('../config').db;

var pool = mysql.createPool(dbConfig);

var query = function (sql, options, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err, null);
            return;
        }
        connection.query(sql, options, function (error, results) {
            connection.release();
            callback(error, results);
        });
    });
};

module.exports.pool = pool;
exports.query = query;
