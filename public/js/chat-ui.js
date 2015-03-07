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

function appendMessageToElement(message, element) {
    var displayMessage = 'Me: ' + message,
        newElement = $('<div class="message-from"></div>').text(displayMessage);

    element.append(newElement);
    element.scrollTop(element.prop('scrollHeight'));
}

function processUserInput(chatApp, socket) {
    var sendMessage = $('#send-message'),
        message = sendMessage.val();

    if (message) {
        var messageBox = $('#messages'),
            currentGroup = $('#currentGroup').val();

        chatApp.sendMessage(currentGroup, message);

        // append message to element
        appendMessageToElement(message, messageBox);

        sendMessage.val('');
    }
}

// start socket.io
var socket = io.connect();

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
                    message = data.fromUser + ': ' + data.text,
                    newElement = $('<div class="message-to"></div>').text(message);

                // check admin -> user
                if (data.fromUser === 'admin') {
                    messageBox = $('#messages');

                    messageBox.append(newElement);
                } else {
                    var group = data.group,
                        prefixDisplayMessageBox = 'display_message_',
                        prefixForm = 'form_',
                        prefixMessageInput = 'message_',
                        messageBox;

                    // append message to chat window if chat window is exists
                    if ($('#' + prefixDisplayMessageBox + group).length) {
                        $('#' + prefixDisplayMessageBox + group).append(newElement);
                    } else {
                        // create chat window if not exists
                        var template = createChatWindow(group),
                            popover = $(template);

                        messageBox = popover.find('#' + prefixDisplayMessageBox + group);

                        messageBox.append(newElement);

                        $('#content').append(popover);
                    }

                    // handle admin send message -> user
                    $('#' + prefixForm + group).submit(function(e) {
                        e.preventDefault();

                        var sendMessage = $('#' + prefixMessageInput + group),
                            message = sendMessage.val();

                        if (message) {
                            chatApp.sendMessage(group, message);

                            messageBox = $('#' + prefixDisplayMessageBox + group);

                            appendMessageToElement(message, messageBox);

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