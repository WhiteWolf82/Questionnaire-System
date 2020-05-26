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

router.get('/add', function(req, res, next) {
    res.render('naire/add');
})

router.get('/question', function(req, res, next) {
    res.render('naire/question');
})

module.exports = router;