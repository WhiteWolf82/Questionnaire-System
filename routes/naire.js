var express = require('express');
var router = express.Router();

router.get('/all', function(req, res, next) {
    res.render('naire/all');
});

router.get('/star', function(req, res, next) {
    res.render('naire/star');
});

router.get('/trashbin', function(req, res, next) {
    res.render('naire/trashbin');
});

module.exports = router;