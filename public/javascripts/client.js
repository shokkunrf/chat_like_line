const socket = io();

const login = {
    'usr': Math.random()
}

//送信
document.getElementById('send_form').addEventListener('submit', () => {
    const send_user = login.usr,
        send_message = document.getElementById('send_message'),
        send_time = new Date();
    //未入力を送信しない
    if (!send_message.value) return;

    const send_data = JSON.stringify({
        'usr': send_user,
        'msg': send_message.value,
        'time': `${send_time}`
    });

    //サーバへ送る
    socket.emit('send_to_server', send_data);
    //入力欄を白紙にする
    send_message.value = '';
});

//受信
socket.on('send_to_client', (receive_data) => {
    const data = JSON.parse(receive_data),
        date = new Date(data.time);
    const message = document.getElementById('chat_messages').appendChild(document.createElement('li'));
    const template = `
                <div>${data.usr}</div>
                <div>${data.msg}</div>
                <div>${date.getHours()}:${date.getMinutes()}</div>
            `;

    message.setAttribute('id', 'messageId' + data.id);
    message.setAttribute('class', 'message');

    //既読処理
    if (data.read === true) message.setAttribute('class', 'read');

    message.innerHTML = template;
});

//既読送信
document.getElementById('btn_read').addEventListener('click', () => {
    socket.emit('read_already', login.usr, Date.now());
});
//既読受信
socket.on('read_already', (receive_data) => {
    const data = JSON.parse(receive_data);
    //送られてきたデータに該当するメッセージに既読のクラスを追加する
    document.getElementById('messageId' + data.id).setAttribute('class', 'read');

});

