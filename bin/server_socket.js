
let server_socket = (server) => {
  const io = require('socket.io')(server);

  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    socket.on('chat message', function (msg) {
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });
  });

  server.listen(3000, function () {
    console.log('listening on *:3000');
  });

};

module.exports = server_socket;