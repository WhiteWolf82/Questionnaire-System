var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('users/login');
});

router.get('/register', function(req, res, next) {
  res.render('users/register');
});

router.get('/info', function(req, res, next) {
  res.render('users/info');
});

router.get('/modifypasswd', function (req, res, next) {
  res.render('users/modifypasswd');
});

module.exports = router;