
//全体のチャットデータ
let chat_data = [
  {
    'usr': 'Vadar',
    'msg': 'I am your father',
    'time': '2018-07-03T02:51:01.831Z',
  }
];

let server_socket = (server) => {

  const io = require('socket.io')(server);

  //接続中のイベント
  io.on('connection', (socket) => {
    //接続時のイベント
    console.log('a user connected');

    //切断時のイベント
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    //クライアントからの受信時のイベント
    socket.on('send_to_server', (send_data) => {
      let data = JSON.parse(send_data);

      //メッセージが未入力の場合なにもしない
      if (!data.msg) return;

      //サーバ側で保持
      chat_data.push(data);
      //全クライアントへ送る
      io.emit('send_to_client', JSON.stringify(data));
    });
  });

  server.listen(3000, function () {
    console.log('listening on *:3000');
  });
};

module.exports = server_socket;