var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname +'/public'));
app.get('/', function(req, res){
	res.sendFile(__dirname+'/public/index.html');
});

var usernames = {};

io.sockets.on('connection', function (socket) {
	socket.on('otherFile', function (data) {
        io.sockets.emit('otherformat', socket.username, data);
    });
	 
	 socket.on('userImage', function (data) {
        io.sockets.emit('addimage', socket.username, data);
    });

	socket.on('sendchat', function (data) {
		io.sockets.emit('sendmsg', socket.username, data);
	});

	socket.on('adduser', function(username){
		socket.username = username;
		usernames[username] = username;
		socket.emit('updatechat', 'welcome! you have connected');
		socket.broadcast.emit('updatechat', username + ' has connected');
		io.sockets.emit('updateusers', usernames);
	});

	socket.on('disconnect', function(){
		delete usernames[socket.username];
		io.sockets.emit('updateusers', usernames);
		socket.broadcast.emit('updatechat', socket.username + ' has disconnected');
	});
});

var port = 3000;
server.listen(port);
console.log("Server running...");