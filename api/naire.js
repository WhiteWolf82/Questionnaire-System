var db = require('./database');
var createError = require('http-errors');
var api = require('./func');
const jwt = require('jsonwebtoken');
const secretKey = require('../config').key;
const fs = require('fs');

exports.addNaire = function (req, res, next) {
    var sql = "INSERT INTO questionnaire(username, naire_id, naire_title, naire_info, naire_status, create_time, start_time, end_time, is_star, is_trash) \
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    var username = req.body['username'];
    var naire_id = req.body['naire_id'];
    var naire_title = req.body['naire_title'];
    var naire_info = req.body['naire_info'];
    var naire_status = req.body['naire_status'] * 1;
    var create_time = req.body['create_time'];
    var start_time = req.body['start_time'];
    var end_time = req.body['end_time'];
    db.query(sql, [username, naire_id, naire_title, naire_info, naire_status, create_time, start_time, end_time, false, false], function(err, results) {
        if (err) {
            console.log(err);
            next(createError(500));
        } else {
            res.send({ result: true });
        }
    })
}

exports.changeStarStatus = function (req, res, next) {
    var sql = "UPDATE questionnaire SET is_star =";
    if (req.query.status === 'false')
        sql += " true ";
    else
        sql += " false ";
    sql += "WHERE naire_id = ?";
    var naire_id = req.query.naire_id;
    db.query(sql, [naire_id], function(err, results) {
        if (err) {
            console.log(err);
            res.send({ result: false });
        } else {
            res.send({ result: true });
        }
    })
}

exports.changeTrashStatus = function (req, res, next) {
    //console.log(req.query);
    var sql = "UPDATE questionnaire SET is_trash =";
    if (req.query.status === 'true')
        sql += " false ";
    else
        sql += " true, is_star = false ";
    sql += "WHERE naire_id = ?";
    var naire_id = req.query.naire_id;
    db.query(sql, [naire_id], function(err, results) {
        if (err) {
            console.log(err);
            res.send({ result: false });
        } else {
            res.send({ result: true });
        }
    })
}

exports.deleteNaire = function (req, res, next) {
    var sql = "DELETE FROM questionnaire WHERE naire_id = ?";
    var naire_id = req.query.naire_id;
    db.query(sql, [naire_id], function(err, results) {
        if (err) {
            console.log(err);
            res.send({ result: false });
        } else {
            sql = "DELETE FROM question WHERE naire_id = ?";
            db.query(sql, [naire_id], function(err, results) {
                if (err) {
                    console.log(err);
                    res.send({ result: false });
                } else {
                    sql = "DELETE FROM answer WHERE naire_id = ?";
                    db.query(sql, [naire_id], function(err, results) {
                        if (err) {
                            console.log(err);
                            res.send({ result: false });
                        } else {
                            res.send({ result: true });
                        }
                    })
                }
            })
        }
    })
}

exports.getAllNaire = function (req, token, res) {
    api.parseToken(token, res, function (username, res) {
        var sql = "SELECT * FROM questionnaire WHERE username = ?";
        if (req.query.star.length !== 0)
            sql += " AND is_star = true ";
        if (req.query.trash.length !== 0)
            sql += " AND is_trash = true ";
        else
            sql += " AND is_trash = false ";
        db.query(sql, [username], function(err, results) {
            if (err) {
                console.log(err);
                next(createError(500));
            } else {
                for (var i = 0; i < results.length; i++) {
                    if (results[i].naire_status === -1)
                        results[i].naire_status = "未发布";
                    else if (results[i].naire_status === 0)
                        results[i].naire_status = "已发布";
                    else
                        results[i].naire_status = "已结束";
                    results[i].create_time = api.transformTime(results[i].create_time);
                    results[i].start_time = api.transformTime(results[i].start_time);
                    results[i].end_time = api.transformTime(results[i].end_time);
                }
                res.send({ code: 0, data: results });
            }
        })
    })
}

exports.getNaire = function (req, token, res, next) {
    api.parseToken(token, res, function (username, res) {
        var sql = "SELECT * FROM questionnaire WHERE username = ?";
        if (req.query.star.length !== 0)
            sql += " AND is_star = true ";
        if (req.query.trash.length !== 0)
            sql += " AND is_trash = true ";
        else
            sql += " AND is_trash = false ";
        if (req.query.id.length !== 0)
            sql += " AND naire_id = '" + req.query.id + "'";
        if (req.query.title.length !== 0)
            sql += " AND naire_title = '" + req.query.title + "'";
        if (req.query.status.length !== 0)
            sql += " AND naire_status = " + req.query.status;
        db.query(sql, [username], function(err, results) {
            if (err) {
                console.log(err);
                next(createError(500));
            } else {
                for (var i = 0; i < results.length; i++) {
                    if (results[i].naire_status === -1)
                        results[i].naire_status = "未发布";
                    else if (results[i].naire_status === 0)
                        results[i].naire_status = "已发布";
                    else
                        results[i].naire_status = "已结束";
                    results[i].create_time = api.transformTime(results[i].create_time);
                    results[i].start_time = api.transformTime(results[i].start_time);
                    results[i].end_time = api.transformTime(results[i].end_time);
                }
                res.send({ code: 0, data: results });
            }
        })
    })
}

exports.addQuestion = function (req, res, next) {
    var sql = "INSERT INTO question(question_id, naire_id, question_type, question_title, question_option) VALUES(?, ?, ?, ?, ?)";
    var question_id = req.body['question_id'];
    var naire_id = req.body['naire_id'];
    var question_type = req.body['question_type'] * 1;
    var question_title = req.body['question_title'];
    var question_option = req.body['question_option'];
    db.query(sql, [question_id, naire_id, question_type, question_title, question_option], function(err, results) {
        if (err) {
            console.log(err);
            next(createError(500));
        } else {
            res.send({ result: true });
        }
    })
}

exports.addAnswer = function (req, res, next) {
    var sql = "INSERT INTO answer(username, answer_id, naire_id, answer_type, answer_option) VALUES(?, ?, ?, ?, ?)";
    var username = req.body['username'];
    var answer_id = req.body['answer_id'];
    var naire_id = req.body['naire_id'];
    var answer_type = req.body['answer_type'] * 1;
    var answer_option = req.body['answer_option'];
    db.query(sql, [username, answer_id, naire_id, answer_type, answer_option], function(err, results) {
        if (err) {
            console.log(err);
            next(createError(500));
        } else {
            res.send({ result: true });
        }
    })
}

exports.getAnswer = function (req, res, next) {
    var sql = "SELECT * FROM answer WHERE naire_id = ?";
    var naire_id = req.body['naire_id'];
    db.query(sql, [naire_id], function(err, results) {
        if (err) {
            console.log(err);
            next(createError(403));
        } else {
            res.send({ data: results });
        }
    })
}

exports.getIndexInfo = function (token, res) {
    api.parseToken(token, res, function (username, res) {
        var sql = "SELECT username FROM user WHERE username = ?";
        db.query(sql, [username], function (err, results) {
            if (err) {
                console.log(err);
                res.send({ result: false });
            }
            else {
                if (results.length != 1)
                    next(createError(403));
                else {
                    var username = results[0].username;
                    sql = "SELECT * FROM questionnaire WHERE username = ?";
                    db.query(sql, [username], function (err, results) {
                        if (err) {
                            console.log(err);
                            res.send({ result: false });
                        }
                        else {
                            var allNaire = results;
                            res.send({ result: true, naireList: allNaire, username: username });
                        }
                    });
                }
            }
        });
    });
}