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

    // if user input begins with slash, treat it as command
    if (message.charAt(0) == '/') {
        systemMessage = chatApp.processCommand(message);

        if (systemMessage) {
            messageBox.append(divSystemContentElement(systemMessage));
        }
    } else {
        var room = $('#room').text();

        chatApp.sendMessage(room, message);

        messageBox.append(divEscapedContentElement(message));
        messageBox.scrollTop(messageBox.prop('scrollHeight'));
    }

    sendMessage.val('');
}

// start socket.io
var socket = io.connect();

$(document).ready(function() {
    var chatApp = new Chat(socket),
        sendMessage = $('#send-message'),
        sendForm = $('#send-form'),
        messageBox = $('#messages'),
        roomListBox = $('#room-list'),
        roomBox = $('#room');

    // display results of a name change attempt
    socket.on('nameResult', function(result) {
        var message;

        if (result.success) {
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message;
        }

        messageBox.append(divSystemContentElement(message));
    });

    // display result of a room change
    socket.on('joinResult', function(result) {
        roomBox.text(result.room);

        messageBox.append(divSystemContentElement('Room changed.'));
    });

    // display received message
    socket.on('message', function(message) {
        var newElement = $('<div></div>').text(message.text);

        messageBox.append(newElement);
    });

    // display list of room available
    socket.on('rooms', function(rooms) {
        roomListBox.empty();

        for (var room in rooms) {
            room = room.substring(1, room.length);

            if (room != '') {
                roomListBox.append(divEscapedContentElement(room));
            }
        }

        // allow click of room name to change to that room
        $('#room-list div').click(function() {
            chatApp.processCommand('/join ' + $(this).text());

            sendMessage.focus();
        });
    });

    // request list of rooms available intermittently
    setInterval(function() {
        socket.emit('rooms');
    }, 1000);

    sendMessage.focus();

    sendForm.submit(function() {
        processUserInput(chatApp, socket);

        return false;
    });
});