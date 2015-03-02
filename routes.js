'use strict';
var maxAge = 1e9;

function render(page, res) {
    return res.sendFile(__dirname + '/public/' + page + '.html');
}

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });

    app.get('/admin', function(req, res) {
        // set user id for user
        res.cookie('userID', 'admin', {
            maxAge: maxAge
        });

        render('admin', res);
    });

    app.post('/admin', function(req, res) {

    });

    app.get('/user', function(req, res) {
        // set user id for user
        res.cookie('userID', 'user', {
            maxAge: maxAge
        });

        render('user', res);
    });

    app.post('/user', function(req, res) {

    });
};