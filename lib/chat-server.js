var socketIO = require('socket.io'),
    nickNames = {},
    io;

exports.listen = function(server) {
    // start socket.io server, allowing it to piggyback on existing HTTP server
    io = socketIO.listen(server);

    io.on('connection', function(socket) {
        // assign user a guest name when they connect
        assignGuestName(socket);

        // private message
        handleSendMessage(socket);
    });
};

function assignGuestName(socket) {
    socket.on('newUser', function(user) {
        var users = Object.keys(nickNames);

        if (users.length === 0) {
            nickNames['admin'] = socket;
        } else {
            if (!nickNames[user]) {
                nickNames[user] = socket;
            }
        }

        console.log(nickNames);
    });
}

function handleSendMessage(socket) {
    socket.on('message', function(from, to, message) {
        console.log('message', from, to, message);
        if (nickNames[to]) {
            console.log('to ' + to);
            nickNames[to].emit('to ' + to, {
                text: message,
                from: from,
                to: to
            });
        }
    });
}