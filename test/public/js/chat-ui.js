function createChatWindow(group) {
    var template = [
        '<div class="window-message" id="window_' + group + '">',
        '<div class="display-message" id="display_message_' + group + '"></div>',
        '<form method="POST" id="form_' + group + '">',
        '<input type="hidden" id="group_' + group + '">',
        '<input id="message_' + group + '" type="text" autocomplete="off" />',
        '</form>',
        '</div>'
    ];

    return template.join('');
}

function appendMessageToElement(message, user, element, className) {
    var displayMessage = user + ': ' + message,
        newElement = $('<div class="' + className + '"></div>').text(displayMessage);

    element.append(newElement);
    element.scrollTop(element.prop('scrollHeight'));
}

function processUserInput(chatApp, socket) {
    var sendMessage = $('#send-message'),
        message = sendMessage.val();

    if (message) {
        var messageBox = $('#messages'),
            currentGroup = $('#currentGroup').val(),
            userSent = 'Me',
            className = 'message-from';

        chatApp.sendMessage(currentGroup, message);

        // append message to element
        appendMessageToElement(message, userSent, messageBox, className);

        sendMessage.val('');
    }
}

// start socket.io
var socket = io.connect('http://localhost:2222');

$(document).ready(function() {
    var chatApp = new Chat(socket),
        sendMessage = $('#send-message'),
        sendForm = $('#send-form'),
        currentGroup = $('#currentGroup'),
        messageBox;

    socket.on('clientMessage', function(clientData) {
        switch (clientData.code) {
            case 'JOIN_GROUP':
                var group = clientData.data.group;

                // set current room to form
                currentGroup.val(group);

                break;
            case 'RECEIVE_MESSAGE':
                var data = clientData.data,
                    className = 'message-to',
                    messageBox;

                // check if admin sent to user
                if (data.fromUser === 'admin') {
                    messageBox = $('#messages');

                    appendMessageToElement(data.text, data.fromUser, messageBox, className);
                } else {
                    var group = data.group,
                        prefixDisplayMessageBox = 'display_message_',
                        prefixForm = 'form_',
                        prefixMessageInput = 'message_';

                    // append message to chat window if chat window is exists
                    if ($('#' + prefixDisplayMessageBox + group).length) {
                        messageBox = $('#' + prefixDisplayMessageBox + group);

                        appendMessageToElement(data.text, data.fromUser, messageBox, className);
                    } else {
                        // create chat window if not exists
                        var template = createChatWindow(group),
                            popover = $(template);

                        messageBox = popover.find('#' + prefixDisplayMessageBox + group);

                        appendMessageToElement(data.text, data.fromUser, messageBox, className);

                        $('#content').append(popover);
                    }

                    // handle admin send message -> user
                    $('#' + prefixForm + group).submit(function(e) {
                        e.preventDefault();

                        var sendMessage = $('#' + prefixMessageInput + group),
                            message = sendMessage.val();

                        if (message) {
                            // send message to server
                            chatApp.sendMessage(group, message);

                            var userSent = 'Me';

                            // re-assign class name
                            className = 'message-from';

                            messageBox = $('#' + prefixDisplayMessageBox + group);

                            appendMessageToElement(message, userSent, messageBox, className);

                            sendMessage.val('');
                        }

                        return false;
                    });
                }

                break;
        }
    });

    // handle user send message -> admin
    sendMessage.focus();

    sendForm.submit(function() {
        processUserInput(chatApp, socket);

        return false;
    });
});