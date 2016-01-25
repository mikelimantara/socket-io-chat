var socket = io();
var username = prompt('Please enter your desired username');

socket.emit('new connection', { 'name': username });

$('form').submit(function(){
    socket.emit('chat message', { 'name': username, 'message': $('#m').val() });
    appendMessage(username + ': ' + $('#m').val());
    $('#m').val('');
    return false;
});

$('#room-main').on("click", function() {
    addUserToRoom('main');
});

$('#room-1').on("click", function() {
	addUserToRoom('room1');
});

$('#room-2').on("click", function() {
    addUserToRoom('room2');
});

socket.on('chat message', function(data){
    appendMessage(data.name + ': ' + data.message);
});

socket.on('notify connected user', function(data) {
    appendMessage(data.name + ' is connected');
});

socket.on('notify disconnected user', function(data) {
	appendMessage(data.name + ' is disconnected');
});

socket.on('update room chat', function(data) {
	appendMessage(data);
});

function appendMessage(message) {
    $('#messages').append($('<li>').text(message));
}

function addUserToRoom(room) {
    socket.emit('add user', { 'name': username, 'room': room} )
}