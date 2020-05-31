var express = require('express');

const fs = require('fs');
const path = require('path');

var multer = require('multer');

var userApi = require('../api/user.js');
var funcApi = require('../api/func.js');
var naireApi = require('../api/naire.js');
var router = express.Router();

router.get('/login', function (req, res, next) {
	console.log("123");
	const username = req.query['username'];
	const passwd = req.query['password'];
	userApi.login(username, passwd, res);
});

router.get('/register', function (req, res, next) {
	const username = req.query['username'];
	const passwd = req.query['password'];
	const email = req.query['email'];
	userApi.register(username, passwd, email);
	res.send({ result: true });
});

router.get('/getIndexInfo', function (req, res, next) {
	const token = funcApi.parseCookie(req.headers['cookie'], 'token');
	naireApi.getIndexInfo(token, res);
});

router.get('/getUserInfo', function (req, res, next) {
	const token = funcApi.parseCookie(req.headers['cookie'], 'token');
	userApi.getUserInfo(token, res);
});

router.post('/setUserInfo', function (req, res, next) {
	//console.log(req.body);
	userApi.setUserInfo(req, res);
});

router.post('/resetPasswd', function (req, res, next) {
	const token = funcApi.parseCookie(req.headers['cookie'], 'token');
	userApi.resetPasswd(req, token, res);
})

router.get('/getAllNaire', function (req, res, next) {
	const token = funcApi.parseCookie(req.headers['cookie'], 'token');
	naireApi.getAllNaire(req, token, res);
});

router.get('/getNaire', function (req, res, next) {
	const token = funcApi.parseCookie(req.headers['cookie'], 'token');
	naireApi.getNaire(req, token, res);
});

router.get('/getNaireAndQuestion', function (req, res, next) {
	naireApi.getNaireAndQuestion(req, res);
});

router.get('/trashNaire', function (req, res, next) {
	naireApi.changeTrashStatus(req, res);
});

router.get('/deleteNaire', function (req, res, next) {
	naireApi.deleteNaire(req, res);
});

router.get('/starNaire', function (req, res, next) {
	naireApi.changeStarStatus(req, res);
});

router.post('/addNaire', function (req, res, next) {
	const token = funcApi.parseCookie(req.headers['cookie'], 'token');
	naireApi.addNaire(req, token, res);
});

router.post('/updateNaire', function (req, res, next) {
	naireApi.updateNaire(req, res);
});

router.post('/addQuestion', function (req, res, next) {
	naireApi.addQuestion(req, res);
});

router.get('/delQuestion', function (req, res, next) {
	naireApi.delQuestion(req, res);
});

router.post('/updateQuestion', function (req, res, next) {
	naireApi.updateQuestion(req, res);
});

router.get('/getAnswerInfo', function (req, res, next) {
	naireApi.getAnswerInfo(req, res);
});

router.post('/addAnswer', function (req, res, next) {
	//console.log(req);
	const token = funcApi.parseCookie(req.headers['cookie'], 'token');
	naireApi.addAnswer(req, token, res);
});

router.post('/updateAnswerInfo', function (req, res, next) {
	naireApi.updateAnswerInfo(req, res);
});

router.get('/getAnswer', function (req, res, next) {
	naireApi.getAnswer(req, res);
})

module.exports = router;