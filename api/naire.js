var db = require('./database');
var createError = require('http-errors');

exports.addNaire = function (req, res, next) {
    var sql = "INSERT INTO questionnaire(username, naire_id, naire_title, naire_info, naire_status, create_time, start_time, end_time) \
    VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
    var username = req.body['username'];
    var naire_id = req.body['naire_id'];
    var naire_title = req.body['naire_title'];
    var naire_info = req.body['naire_info'];
    var naire_status = req.body['naire_status'] * 1;
    var create_time = req.body['create_time'];
    var start_time = req.body['start_time'];
    var end_time = req.body['end_time'];
    db.query(sql, [username, naire_id, naire_title, naire_info, naire_status, create_time, start_time, end_time], function(err, results) {
        if (err) {
            console.log(err);
            next(createError(500));
        } else {
            res.send({ result: true });
        }
    })
}

exports.addQuestion = function (req, res, next) {
    var sql = "INSERT INTO question(question_id, naire_id, question_type, question_title, question_option) VALUES(?, ?, ?, ?, ?)";
    var question_id = req.body['question_id'];
    var naire_id = req.body['naire_id'];
    var question_type = req.body['question_type'] * 1;
    var question_title = req.body['question_title'];
    var question_option = req.body['question_option'];
    db.query(sql, [question_id, naire_id, question_type, question_title, question_option], function(err, results)) {
        if (err) {
            console.log(err);
            next(createError(500));
        } else {
            res.send({ result: true });
        }
    }
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

exports.getAnswer = function(req, res, next) {
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