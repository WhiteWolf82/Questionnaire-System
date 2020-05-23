const jwt = require('jsonwebtoken');
const secretKey = require('../config').secretKey;

exports.parseToken = function (token, res, callback) {
    if (typeof (token) == 'undefined' || token == "") {
        callback("00000000000", res);
    } else
        jwt.verify(token, secretKey, function (err, decode) {
            if (err) {
                console.log(err);
                res.send({ result: false });
            } else {
                callback(decode.username, res);
            }
        })
}

exports.parseCookie = function (cookie, key) {
    if (typeof (cookie) == 'undefined')
        return "";
    else {
        var name = key + "=";
        var ca = cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
    }
    return "";
}

function addZero(m) {
    return m < 10 ? '0' + m : m;
}

exports.transformTime = function (date) {
    y = date.getFullYear();
    M = date.getMonth() + 1;
    d = date.getDate();
    h = date.getHours();
    m = date.getMinutes();
    s = date.getSeconds();
    return y + '-' + addZero(M) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s);
}