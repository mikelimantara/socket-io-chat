var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

users = [];
rooms = ['main', 'room1', 'room2'];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/main.js', function(req, res){
  res.sendFile(__dirname + '/main.js');
});

io.on('connection', function(socket){
  socket.on('new connection', function(data){
    users.push( {'name': data.name, 'socketId': socket.id} );
    socket.join('main');
    socket.room = 'main';
    socket.broadcast.to(socket.room).emit('notify connected user', data);
  });

  socket.on('add user', function(data) {
    socket.leave(socket.room);
    socket.join(data.room);
    socket.room = data.room;
    socket.emit('update room chat', 'You have connected to ' + socket.room);
    socket.broadcast.to(socket.room).emit('update room chat', data.name + ' has connected to this room');
  });

  socket.on('chat message', function(msg){
    socket.broadcast.to(socket.room).emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    var disconnectedUser = getUserFromSocketId(socket.id);
    if (disconnectedUser) {
      socket.broadcast.to(socket.room).emit('notify disconnected user', {'name': disconnectedUser.name});
      removeUser(disconnectedUser);
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function getUserFromSocketId(socketId){
  for (var i = 0; i < users.length; i++) {
    if (users[i].socketId === socketId) {
      return users[i];
    }
  }

  return null;
}

function removeUser(user){
  for (var i = 0; i < users.length; i++) {
    if (users[i] === user) {
      users.splice(i, 1);
    }
  }
}