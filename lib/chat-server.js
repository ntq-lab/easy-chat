var socketIO = require('socket.io'),
    conf = require('../config'),
    rooms = {},
    nickNames = {},
    io;

exports.listen = function(server) {
    // start socket.io server, allowing it to piggyback on existing HTTP server
    io = socketIO.listen(server);

    io.on('connection', function(socket) {
        // assign user a guest name when they connect
        var userID = getCurrentUser(socket);

        assignGuestName(socket, userID);

        handleSendCurrentUserInfo(socket, userID);

        // create room
        socket.on('newRoom', function(data) {
            socket.join(data.room);

            rooms[data.room] = data.userCreated;
        });

        // message
        handleSendMessage(socket);
    });
};

function getCurrentUser(socket) {
    var cookies = socket.handshake.headers['cookie'].split(';'),
        userID;

    cookies.forEach(function(cookie) {
        if (cookie.indexOf(conf.cookies.userID.key)) {
            var userCookies = cookie.split('=');

            userID = userCookies.pop();
        }
    });

    return userID;
}

function assignGuestName(socket, userID) {
    // store userID to list
    nickNames[userID] = socket;
}

function handleSendCurrentUserInfo(socket, currentUser) {
    socket.emit('currentUser', currentUser);
}

function handleSendMessage(socket) {
    socket.on('message', function(data) {
        // if (nickNames[to]) {
            // console.log('room', room);
            console.log('message', data);

            if (data.room !== 'admin') {
                nickNames['admin'].join(data.room);
            }

            // socket.join(data.from);
            // if (to === 'admin') {
                // socket.join(room);
            // }

            // console.log(nickNames[to]);
            socket.broadcast.to(data.room).emit('message', {
                text: data.text,
                room: data.room
            });
        // }
    });
}