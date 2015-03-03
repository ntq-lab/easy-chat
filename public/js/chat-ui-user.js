function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket, room) {
    var sendMessage = $('#send-message'),
        message = sendMessage.val(),
        messageBox = $('#messages'),
        currentRoom = $('#currentUser').val();

    chatApp.sendMessage(currentRoom, message);

    messageBox.append(divEscapedContentElement(message));
    messageBox.scrollTop(messageBox.prop('scrollHeight'));

    sendMessage.val('');
}

// start socket.io
var socket = io.connect();

$(document).ready(function() {
    var chatApp = new Chat(socket),
        sendMessage = $('#send-message'),
        sendForm = $('#send-form'),
        messageBox = $('#messages'),
        currentUser = $('#currentUser');

    // get current user info
    socket.on('currentUser', function(userID) {
        // set current user to form
        currentUser.val(userID);
        console.log(userID);
        socket.emit('newRoom', {
            userCreated: userID,
            room: userID
        });
    });

    // display received message
    socket.on('message', function(data) {
        console.log('received message', data);

        var newElement = $('<div></div>').text(data.text);

        messageBox.append(newElement);
    });

    sendMessage.focus();

    sendForm.submit(function() {
        processUserInput(chatApp, socket);

        return false;
    });
});