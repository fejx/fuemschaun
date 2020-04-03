var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io')(server);

var port = process.env.PORT || 3000;
server.listen(port, function () {
	console.log('werbserver listens on port ', port);
});

let hosted_sessions = {};
let joined_sessions = {};

function notifyOthers(socket, ids, event, data) {
	console.log('notifying others')
	logAndEmit(socket, 'ok', 'transmitting event ' + event + ' from ' + socket.id + ' to others')
	for (let id of ids) {
		console.log('receiver id ', id);
		io.to(id).emit(event, data);
	}
}

function logAndEmit(socket, event, message) {
	socket.emit(event, message);
	console.log(message);
}

function closeSession(socket, message = false) {
	logAndEmit(socket, 'quit', message ? message : 'sessionId ' + socket.id + ' does not exist');
	socket.disconnect(true)
}

function trySendingToReceivers(socket, event, data) {
	console.log('got a ' + event + ' event');
	// for safety reasons
	data = {
		position: data.position
	};
	socketId = socket.id;
	if (socketId in joined_sessions) {
		notifyOthers(socket, hosted_sessions[joined_sessions[socketId].sessionId].sessionIds, event, data);
	} else if (socketId in hosted_sessions) {
		notifyOthers(socket, hosted_sessions[socketId].sessionIds, event, data);
	} else {
		closeSession(socket);
	}
}

io.on('disconnect', (reason) => {
	console.log('got a disconnect')
});

io.on('connection', function (socket) {
	var addedUser = false;
	console.log('got a new connection');
	console.log('sessionid: ', socket.id);
	
	console.log(socket.request.headers);

	if ("joinid" in socket.request.headers) {
		id = socket.request.headers.joinid
		if (id in hosted_sessions) {
			joined_sessions[socket.id] = {
				"user": username,
				"sessionId": id
			};
			hosted_sessions[id].sessionIds.push(socket.id)
			console.log(hosted_sessions[id].sessionIds)
			socket.emit('joined', 'session exists');
			console.log('session ' + id + ' exists');
		} else {
			socket.disconnect(true);
		}
	} else if ('username' in socket.request.headers) {
		username = socket.request.headers.username
		socket.emit('created', 'user ' + username + ' created session with id ' + socket.id);
		console.log('user ' + username + ' created session with id ' + socket.id);
		hosted_sessions[socket.id] = {
			"user": username,
			"sessionIds": [ socket.id ]
		};
	} else {
		closeSession(socket, 'need to define username')
	}

	socket.on('pause', function (data) {
		trySendingToReceivers(socket, 'pause', data)
	});

	socket.on('play', function (data) {
		trySendingToReceivers(socket, 'play', data)
	});

	socket.on('buffer', function (data) {
		trySendingToReceivers(socket, 'buffer', data)
	});
});
