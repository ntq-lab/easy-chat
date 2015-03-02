function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
    var sendMessage = $('#send-message'),
        message = sendMessage.val(),
        messageBox = $('#messages'),
        systemMessage;

    chatApp.sendMessage('user', 'admin', message);

    messageBox.append(divEscapedContentElement(message));
    messageBox.scrollTop(messageBox.prop('scrollHeight'));

    sendMessage.val('');
}

function assignNewUser(socket) {
    socket.emit('newUser', 'user');
}

// start socket.io
var socket = io.connect();

$(document).ready(function() {
    var chatApp = new Chat(socket),
        sendMessage = $('#send-message'),
        sendForm = $('#send-form'),
        messageBox = $('#messages');

    // assign user
    assignNewUser(socket);

    // display received message
    socket.on('to user', function(data) {
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