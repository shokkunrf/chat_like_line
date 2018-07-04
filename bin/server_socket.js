
//全体のチャットデータ
let chat_data = [
  {
    'id': 0,
    'usr': 'Vadar',
    'msg': 'I am your father',
    'time': '2018-07-03T02:51:01.831Z',
    'read': false
  }
];

let server_socket = (server) => {

  server.listen(3000, function () {
    console.log('listening on *:3000');
  });

  const io = require('socket.io')(server);

  //接続中のイベント
  io.on('connection', (socket) => {
    //接続時のイベント
    console.log('a user connected:' + socket.id);
    chat_data.forEach((element) => {
      //保持しているデータを1つずつクライアントへ送る
      socket.emit('send_to_client', JSON.stringify(element));
    });

    //切断時のイベント
    socket.on('disconnect', function () {
      console.log('user disconnected');
    });

    //クライアントからの受信時のイベント
    socket.on('send_to_server', (send_data) => {
      let data = JSON.parse(send_data);

      //メッセージが未入力の場合なにもしない
      if (!data.msg) return;

      //idを追加
      data.id = chat_data.length;
      //既読フラグを追加
      data.read = false;

      //サーバ側で保持
      chat_data.push(data);
      //全クライアントへ送る
      io.emit('send_to_client', JSON.stringify(data));
    });

    //既読のイベント
    socket.on('read_already', (usr, now) => {
      //ボタンを押したユーザではないユーザのメッセージの未読データを抽出する
      const your_data = chat_data.filter((ele) => {
        return (ele.usr !== usr && ele.read === false);
      });

      your_data.forEach((ele) => {
        //ボタンを押した時刻より前のデータを既読にする
        if (parseInt(now) > Date.parse(ele.time)) {
          ele.read = true;
          //送信クライアント以外のクライアントに既読処理を行ったデータを送る
          socket.broadcast.emit('read_already', JSON.stringify(ele));
        }
      });

    });
  });
};

module.exports = server_socket;