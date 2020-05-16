var db = require('./database');
const jwt = require('jsonwebtoken');

exports.register = function (username, password, email) {
    var SQL = "INSERT INTO user(username, password, email) VALUES (?, ?, ?)";
    db.query(SQL, [username, password, email], function (err, results) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            // console.log("注册成功");
            return true;
        }
    });
}

exports.login = function (username, password, res) {
    var SQL = 'SELECT * FROM user WHERE username = ? and password = ?';
    db.query(SQL, [username, password], function (err, results) {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            if (results.length != 0) {
                // console.log("登录成功");
                //var token = jwt.sign({ username: username }, key, { expiresIn: '24h' });
                res.send({ result: true });
            } else {
                // console.log("登录失败");
                res.send({ result: false });
            }
        }
    });
}