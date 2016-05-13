var chat      = require('../routes/chat.js');

module.exports = function(io) {
    var module = {};

    module.init = function() {
        io.configure(function() {
            io.set('transports', ['xhr-polling']);
            io.set('polling duration', 10);
        });

        io.on('connection', function (socket) {
            console.log('Socket.io Connection');
            
            socket.on('private message', function (chatId, userId, msg) {
                console.log('I received a private message by ', chatId, ' ', userId, ' saying ', msg);

                chat.newMessage(chatId, userId, msg, function(newMessage) {
                    console.log('emit');
                    socket.emit(chatId, {message: newMessage});
                });

            });
        })

    }

    return module;
}