'use strict';
var socketIO = require('socket.io'),
    conf = require('../config'),
    nickNames = {},
    io;

module.exports.listen = function(server) {
    // start socket.io server, allowing it to piggyback on existing HTTP server
    io = socketIO.listen(server);

    io.on('connection', function(socket) {
        // assign user a guest name when they connect
        var userID = getCurrentUser(socket);

        assignGuestName(socket, userID);

        // create room for user
        joinRoom(socket);

        // message
        handleSendMessage(socket);
    });
};

function joinRoom(socket) {
    socket.on('newRoom', function(data) {
        socket.join(data.room);
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

    // send current user info
    socket.emit('currentUser', userID);
}

function handleSendMessage(socket) {
    socket.on('message', function(data) {
        var fromUser = getCurrentUser(socket);

        if (data.room !== 'admin') {
            nickNames['admin'].join(data.room);
        }

        socket.broadcast.to(data.room).emit('message', {
            text: data.text,
            room: data.room,
            fromUser: fromUser
        });
    });
}