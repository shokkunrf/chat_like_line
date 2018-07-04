const socket = io();

document.getElementById('form').addEventListener('submit', () => {
    const message = document.getElementById('m');
    socket.emit('chat message', message.value);
    message.value = '';
});

socket.on('chat message', (msg) => {
    const messages = document.getElementById('messages');
    messages.appendChild(document.createElement('li')).innerText = msg;
});
