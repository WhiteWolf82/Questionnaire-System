var db = require('./database');
const jwt = require('jsonwebtoken');
const key = require('../config').secretKey;
var api = require('./func');

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
                var token = jwt.sign({ username: username }, key, { expiresIn: '24h' });
                res.send({ token: token, result: true });
            } else {
                // console.log("登录失败");
                res.send({ result: false });
            }
        }
    });
}

exports.getUserInfo = function (token, res) {
    api.parseToken(token, res, function (username, res) {
        var sql = "SELECT * FROM user WHERE username = ?";
        db.query(sql, [username], function (err, results) {
            if (err) {
                console.log(err);
                res.send({ result: false });
            } else {
                if (results.length !== 1)
                    next(createError(403));
                else
                    res.send({ result: true, username: username, phone: results[0].phone, email: results[0].email, sex: results[0].sex, info: results[0].info });
            }
        })
    });
}

exports.setUserInfo = function (req, res) {
    var sql = "UPDATE user SET ";
    var username = req.body.username;
    var sex = req.body.sex;
    var phone = req.body.phone;
    var email = req.body.email;
    var info = req.body.info;
    sql += "sex = '" + sex + "'";
    if (phone.length !== 0)
        sql += ", phone = '" + phone + "'";
    if (email.length !== 0)
        sql += ", email = '" + email + "'";
    if (info.length !== 0)
        sql += ", info = '" + info + "'";
    sql += " WHERE username = ?";
    db.query(sql, [username], function (err, results) {
        if (err) {
            console.log(err);
            res.send({ result: false });
        } else {
            res.send({ result: true });
        }
    })
}

exports.resetPasswd = function (req, token, res) {
    api.parseToken(token, res, function (username, res) {
        var sql = "SELECT * FROM user WHERE username = ? AND password = ?";
        var oldPasswd = req.body.oldPasswd;
        var newPasswd = req.body.newPasswd;
        db.query(sql, [username, oldPasswd], function (err, results) {
            if (err) {
                console.log(err);
                res.send({ result: false });
            } else {
                if (results.length != 0) {
                    sql = "UPDATE user SET password = ? WHERE username = ? AND password = ?";
                    db.query(sql, [newPasswd, username, oldPasswd], function (err, results) {
                        if (err) {
                            console.log(err);
                            res.send({ result: false });
                        } else {
                            res.send({ result: true });
                        }
                    })
                } else {
                    res.send({ result: false });
                }
            }
        })
    })
}