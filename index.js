var express = require('express'),
    http = require('http');

// create Express application
var app = express();

// serve static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// create server
var server = http.Server(app);

// var io = socketIO.listen(server);

// io.on('connection', function(socket) {
//     socket.on('chat message', function(msg) {
//         io.emit('chat message', msg);
//     });
// });

server.listen(2222, function() {
    console.log('Listening on port 2222');
});

// providing it with an already defined HTTP server so it can share the same TCP/IPport
var chatServer = require('./lib/chat-server');

chatServer.listen(server);