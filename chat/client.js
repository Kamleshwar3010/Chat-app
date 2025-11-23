const socket = io();

const form = document.getElementById('form');
const messageInput = document.getElementById('input2');
const messageContainer = document.getElementById('txt');
const joinBtn = document.getElementById('btn1');
const nameInput = document.getElementById('input1');
const usernameDiv = document.getElementById('username');
const chatSection = document.querySelector('section');

let name;

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('txtcls');
    messageElement.id = position;
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

joinBtn.addEventListener('click', (e) => {
    e.preventDefault();
    name = nameInput.value;
    if (name) {
        socket.emit('new-user-joined', name);
        usernameDiv.style.display = 'none';
        chatSection.style.display = 'block';
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'reciever');
    socket.emit('send', message);
    messageInput.value = '';
});

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'sender');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'sender');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'sender');
});
