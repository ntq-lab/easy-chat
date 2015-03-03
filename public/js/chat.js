var Chat = function(socket) {
        this.socket = socket;
    },
    proto = Chat.prototype;

proto.sendMessage = function(room, message) {
    this.socket.emit('message', {
        text: message,
        room: room
    });
};