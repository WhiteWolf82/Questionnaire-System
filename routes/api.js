var express = require('express');

const fs = require('fs');
const path = require('path');

var multer = require('multer');

var api = require('../api/user.js');
var router = express.Router();

router.get('/login', function (req, res, next) {
	const username = req.query['username'];
	const passwd = req.query['password'];
	api.login(username, passwd, res);
});

router.get('/register', function (req, res, next) {
	const username = req.query['username'];
	const passwd = req.query['password'];
	const email = req.query['email'];
	api.register(username, passwd, email);
	res.send({ result: true });
});

module.exports = router;