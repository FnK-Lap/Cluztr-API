var chat      = require('../routes/chat.js');

module.exports = function(io) {
    var module = {};

    module.init = function() {

        io.on('connection', function (socket) {
            console.log('Socket.io Connection');

            socket.on('private message', function (chatId, userId, msg) {
                console.log('I received a private message by ', chatId, ' ', userId, ' saying ', msg);

                chat.newMessage(chatId, userId, msg, function(newMessage) {
                    console.log('emit ', {message: newMessage}, ' on ', chatId);
                    io.emit(chatId, {message: newMessage});
                });

            });
        })

    }

    return module;
}