var Chat = function(socket) {
        this.socket = socket;
    },
    proto = Chat.prototype;

proto.sendMessage = function(room, text) {
    var message = {
        room: room,
        text: text
    };

    this.socket.message('message', message);
};

proto.changeRoom = function(room) {
    this.socket.emit('join', {
        newRoom: room
    });
};

proto.processCommand = function(command) {
    var words = command.split(' ');

    // parse command from first word
    var command = words[0]
                        .substring(1, words[0].length)
                        .toLowerCase();

    var message = false;

    switch (command) {
        case 'join':
            words.shift();

            var room = words.join(' ');

            // handle room changing/creating
            this.changeRoom(room);

            break;

        case 'nick':
            words.shift();

            var name = words.join(' ');

            // handle name change attempts
            this.socket.emit('nameAttempt', name);

            break;

        default:
            message = 'Unrecognized command.';

            break;
    }

    return message;
};