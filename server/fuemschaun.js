var express = require('express');
var uuid = require('uuid');
var app = express();
var fs = require('fs');

const port = process.env.PORT || 8889;
const env = process.env.NODE_ENV || "dev";
const max_rooms = 2000;

const certpath = process.env.CERTPATH || "/etc/letsencrypt/live/fuemschaun.hoermannpaul.com/";

var server = undefined;

if (env === "production") {
	var https = require('https');
	server = https.createServer({
		key: fs.readFileSync(certpath + "privkey.pem"),	
		cert: fs.readFileSync(certpath + "fullchain.pem"),	
		ca: fs.readFileSync(certpath + "chain.pem"),	
	})
} else {
	var http = require('http');
	server = http.createServer();
}
	
server.listen(port, function () {
	console.log('werbserver listens on port ', port);
});

var io = require('socket.io')(server);

let existing_rooms = {};

function closeSession(socket, message = false) {
	socket.emit('disconnect', message ? message : 'sessionId ' + socket.id + ' does not exist');
	socket.disconnect()
}

function trySendingToReceivers(socket, event, data) {
	targetRoom = Object.keys(socket.rooms)[1];
	console.log('got a ' + event + ' event on ' + targetRoom);
	// for safety reasons
	data = {
		position: data.position
	};
	io.to(targetRoom).emit(event, data);
}

function deleteRoomIfEmpty(targetRoom) {
	if (Object.keys(existing_rooms[targetRoom]).length < 1) {
		console.log('deleting room ' + targetRoom + ' because no participants are left');
		delete existing_rooms[targetRoom];
	}
}

function removeFromRoom(socket) {
	targetRoom = Object.keys(socket.rooms)[1];
	console.log('got a disconnect on room ', targetRoom);
	let username = undefined
	for (let member of Object.keys(existing_rooms[targetRoom])) {
		if (member == socket.id) {
			username =existing_rooms[targetRoom][member] 
			delete existing_rooms[targetRoom][member]
		}
	}
	deleteRoomIfEmpty(targetRoom);
	io.to(targetRoom).emit('leave', 'user ' + username + ' left the session');
}

function createAndJoinRoomIfMaxRoomsNotReached(socket) {
	if (Object.keys(existing_rooms) > max_rooms) {
		closeSession(socket, 'maximum numbers of parties reached');
	} else {
		dict = {};
		dict[socket.id] = username;
		sessionId = uuid.v4()
		socket.join(sessionId)
		existing_rooms[sessionId] = dict;
		socket.emit('created', 'session does not exist, created new with id ' + sessionId);
		console.log('crated room ' + sessionId);
	}
}

function joinRoomIfExists(socket, joinid) {
	if (joinid in existing_rooms) {
		existing_rooms[joinid][socket.id] = username
		socket.join(joinid)
		io.to(joinid).emit('joined', username + ' joined the session');
		console.log(username + ' joined session ' + joinid);
	} else {
		closeSession(socket, 'session ' + joinid + ' does not exist');
	}
}

io.on('connection', function (socket) {
	console.log('got a new connection with id ', socket.id);
	
	username = socket.handshake.query.username
	joinid = socket.handshake.query.joinid

	if (!username) {
		closeSession(socket, 'need to define username');
	} else if (joinid) {
		joinRoomIfExists(socket, joinid);
	} else {
		createAndJoinRoomIfMaxRoomsNotReached(socket);
	}

	socket.on('disconnecting', function() {
		removeFromRoom(socket);
	})

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