var Chat = function(socket) {
        this.socket = socket;
    },
    proto = Chat.prototype;

proto.sendMessage = function(from, to, message) {
    this.socket.emit('message', from, to, message);
};