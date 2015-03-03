'use strict';
var conf = require('./config');

function render(page, res) {
    return res.sendFile(__dirname + '/public/' + page + '.html');
}

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });

    app.get('/admin', function(req, res) {
        // set user id for user
        if (!req.cookies[conf.cookies.userID.key]) {
            res.cookie(conf.cookies.userID.key, 'admin', {
                maxAge: conf.cookies.maxAge
            });
        }

        render('admin', res);
    });

    app.post('/admin', function(req, res) {

    });

    app.get('/user', function(req, res) {
        // set user id for user
        if (!req.cookies[conf.cookies.userID.key]) {
            var date = new Date();

            res.cookie(conf.cookies.userID.key, 'user_' + date.getTime(), {
                maxAge: conf.cookies.maxAge
            });
        }

        render('user', res);
    });

    app.post('/user', function(req, res) {

    });
};