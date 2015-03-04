function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

function processUserInput(chatApp, socket) {
    var sendMessage = $('#send-message'),
        message = sendMessage.val();

    if (message) {
        var messageBox = $('#messages'),
            currentRoom = $('#currentRoom').val();

        chatApp.sendMessage(currentRoom, message);

        var displayMessage = 'Me: ' + message;

        messageBox.append(divEscapedContentElement(displayMessage));
        messageBox.scrollTop(messageBox.prop('scrollHeight'));

        sendMessage.val('');
    }
}

// start socket.io
var socket = io.connect();

$(document).ready(function() {
    var chatApp = new Chat(socket),
        sendMessage = $('#send-message'),
        sendForm = $('#send-form'),
        messageBox = $('#messages'),
        currentRoom = $('#currentRoom');

    // get current user info
    socket.on('currentUser', function(userID) {
        // set current room to form
        currentRoom.val(userID);

        socket.emit('newRoom', {
            userCreated: userID,
            room: userID
        });
    });

    // display received message
    socket.on('message', function(data) {
        var message = data.fromUser + ': ' + data.text,
            newElement = $('<div></div>').text(message);

        messageBox.append(newElement);

        currentRoom.val(data.room);
    });

    sendMessage.focus();

    sendForm.submit(function() {
        processUserInput(chatApp, socket);

        return false;
    });
});