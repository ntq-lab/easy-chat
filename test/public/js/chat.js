var Chat = function(socket) {
        this.socket = socket;
    },
    proto = Chat.prototype;

proto.sendMessage = function(group, message) {
    this.socket.emit('serverMessage', {
        code: 'SEND_MESSAGE',
        data: {
            text: message,
            group: group
        }
    });
};