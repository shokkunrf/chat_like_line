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

    message.setAttribute('class', 'message');

    message.innerHTML = template;
});
