'use strict';
var socketIO = require('socket.io'),
    conf = require('../config'),
    code = require('./response-code'),
    nickNames = {},
    io;

module.exports.listen = function(server) {
    // start socket.io server, allowing it to piggyback on existing HTTP server
    io = socketIO.listen(server);

    io.on('connection', function(socket) {
        // assign user a guest name when they connect
        var userConnecting = getCurrentUser(socket);

        assignGuestName(socket, userConnecting);

        // create group for user
        userJoinGroup(socket, userConnecting);

        // check admin login then join all groups
        adminJoinGroup();

        // trigger event from client -> server
        socket.on('serverMessage', function(serverData) {
            switch (serverData.code) {
                case code.sendMessage:
                    // receive message
                    receiveMessage(socket, serverData.data);

                    break;
            }
        });
    });
};

function userJoinGroup(socket, group) {
    // user join group
    socket.join(group);

    socket.emit('clientMessage', {
        code: code.joinGroup,
        data: {
            group: group
        }
    });
}

function adminJoinGroup() {
    // assign admin to all groups
    if (nickNames['admin']) {
        Object.keys(nickNames).forEach(function(group) {
            nickNames['admin'].join(group);
        });
    }
}

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

function receiveMessage(socket, data) {
    var fromUser = getCurrentUser(socket);

    socket.broadcast.to(data.group).emit('clientMessage', {
        code: code.receiveMessage,
        data: {
            text: data.text,
            group: data.group,
            fromUser: fromUser
        }
    });
}