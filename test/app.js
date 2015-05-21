'use strict';

var cookieParse = require('cookie-parser'),
    express = require('express'),
    http = require('http');

var conf = require('./config');

var app = express();

app.use(express.static(__dirname + '/public'));

app.use(cookieParse('my-key'));

app.route('/').get(function(req, res) {
    // set user id for user
    if (!req.cookies[conf.cookies.userID.key]) {
        var date = new Date();

        res.cookie(conf.cookies.userID.key, 'user_' + date.getTime(), {
            maxAge: conf.cookies.maxAge
        });
    }

    res.sendFile(__dirname + '/public/index.html');
}).post(function(req, res) {

});

var server = http.Server(app);

server.listen(3333, function() {
    console.log('Listening on port 3333');
});