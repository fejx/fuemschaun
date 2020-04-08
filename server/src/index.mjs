import uuid from 'uuid'
import { readFileSync } from 'fs'
import http from 'http'
import https from 'https'
import socketio from 'socket.io'

const port = process.env.PORT || 8889
const env = process.env.NODE_ENV || 'dev'
const max_rooms = 2000

const certpath = process.env.CERTPATH || '/etc/letsencrypt/live/fuemschaun.hoermannpaul.com/'

const server = createServer()
const io = socketio(server)

function createServer() {
	if (env === 'production') {
		return https.createServer({
			key: readFileSync(certpath + 'privkey.pem'),	
			cert: readFileSync(certpath + 'fullchain.pem'),	
			ca: readFileSync(certpath + 'chain.pem'),	
		})
	} else
		return http.createServer()
}
	
server.listen(port, function () {
	console.log('webserver listens on port ', port)
})

const existingRooms = {}

function closeSession(socket, message = false) {
	socket.emit('disconnect', message ? message : 'sessionId ' + socket.id + ' does not exist')
	socket.disconnect()
}

function trySendingToReceivers(socket, event, data) {
	const targetRoom = Object.keys(socket.rooms)[1]
	console.log('got a ' + event + ' event on ' + targetRoom + ' with the message ' + JSON.stringify(data))
	socket.broadcast.to(targetRoom).emit(event, data)
}

function deleteRoomIfEmpty(targetRoom) {
	if (Object.keys(existingRooms[targetRoom]).length < 1) {
		console.log('deleting room ' + targetRoom + ' because no participants are left')
		delete existingRooms[targetRoom]
	}
}

function removeFromRoom(socket) {
	const targetRoom = Object.keys(socket.rooms)[1]
	console.log('got a disconnect on room ', targetRoom)
	let username = undefined
	for (let member of Object.keys(existingRooms[targetRoom])) {
		if (member == socket.id) {
			username = existingRooms[targetRoom][member]
			delete existingRooms[targetRoom][member]
		}
	}
	deleteRoomIfEmpty(targetRoom)
	io.to(targetRoom).emit('leave', {
		name: username,
		message: 'user ' + username + ' left the session'
	})
}

function createAndJoinRoomIfMaxRoomsNotReached(socket, username) {
	if (Object.keys(existingRooms) > max_rooms) {
		closeSession(socket, 'maximum numbers of parties reached')
	} else {
		const dict = {}
		dict[socket.id] = username
		const sessionId = uuid.v4()
		socket.join(sessionId)
		existingRooms[sessionId] = dict
		socket.emit('created', {
			sessionId: sessionId,
			message: 'session does not exist, created new with id ' + sessionId
		})
		console.log('created room ' + sessionId)
	}
}

function roomExists(sessionId) {
	return sessionId in existingRooms
}

function joinRoom(socket, joinid) {
	existingRooms[joinid][socket.id] = username
	socket.join(joinid)
	io.to(joinid).emit('joined', {
		name: username,
		message: username + ' joined the session'
	})
	console.log(username + ' joined session ' + joinid)
}

io.on('connection', function (socket) {
	const username = socket.handshake.query.username
	let joinid = socket.handshake.query.joinid

	console.log(`got a new connection with id ${socket.id} as user ${username} to session ${joinid}`)

	if (!roomExists(joinid)) {
		// Room does not exist anymore, invalidate the id so a new session gets created instead
		joinid = null
	}

	if (!username) {
		closeSession(socket, 'need to define username')
	} else if (joinid) {
		joinRoom(socket, joinid)
	} else {
		createAndJoinRoomIfMaxRoomsNotReached(socket, username)
	}

	socket.on('disconnecting', function() {
		removeFromRoom(socket)
	})

	socket.on('playback-position', function (data) {
		trySendingToReceivers(socket, 'playback-position', { position: data.position })
	})

	socket.on('playback-status', function (data) {
		trySendingToReceivers(socket, 'play', { playing: data.playing })
	})

	socket.on('buffering', function () {
		trySendingToReceivers(socket, 'buffering', { buffering: true })
	})
})
