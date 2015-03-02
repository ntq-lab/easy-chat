var cookieParser = require('cookie-parser'),
    express = require('express'),
    http = require('http');

// create Express application
var app = express();

// serve static files
app.use(express.static(__dirname + '/public'));

// user cookies parser
app.use(cookieParser('my-key'));

// router
require('./routes')(app);

// create server
var server = http.Server(app);

server.listen(2222, function() {
    console.log('Listening on port 2222');
});

// providing it with an already defined HTTP server so it can share the same TCP/IPport
var chatServer = require('./lib/chat-server');

chatServer.listen(server);