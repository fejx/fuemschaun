import uuid from 'uuid'
import socketio from 'socket.io'
import config from 'config'
import log from 'loglevel'

import { limitClients } from './clientLimiter.mjs'
import { createServer } from './serverSetup.mjs'

log.setDefaultLevel(config.get('logging.level'))

const port = process.env.PORT || config.get('port')

const server = createServer()
const io = socketio(server)

server.listen(port, function () {
	console.log('webserver listens on port ', port)
})

limitClients(io)

io.on('connection', function (socket) {
	// This check is required because the socket might have been rejected by the client limiter
	if (!socket.connected)
		return

	console.debug(`New connection with id ${socket.id}, with parameters '${JSON.stringify(socket.handshake.query)}'`)

	socket.alias = socket.handshake.query.username
	if (!socket.alias) {
		socket.emit('disconnect', 'Missing username')
		socket.disconnect()
		return
	}

	const roomId = determineRoomId(socket)
	joinRoom(socket, roomId)
	sendCurrentStateFromPeer(socket)

	socket.on('disconnecting', function () {
		console.debug(`Connection with id ${socket.id} left (alias: ${socket.alias}, room: ${socket.roomId})`)
		socket.broadcast.to(roomId).emit('leave', {
			name: socket.alias,
			message: `${socket.alias} left`
		})
	})

	createListenersFor(socket)
})

function determineRoomId(socket) {
	const requestedRoom = socket.handshake.query.joinid
	const hasRequest = requestedRoom != null
	if (hasRequest && roomExists(requestedRoom)) {
		return requestedRoom
	}
	else {
		// No room requested or room does not exist anymore
		const newRoomId = getNewRoomId()
		socket.emit('created', {
			sessionId: newRoomId,
		})
		return newRoomId
	}
}

function joinRoom(socket, roomId) {
	socket.join(roomId)
	socket.roomId = roomId
	socket.broadcast.to(roomId).emit('joined', {
		name: socket.alias,
		message: `${socket.alias} joined`
	})
	console.debug(`${socket.alias} joined ${roomId}`)
}

function createListenersFor(socket) {
	socket.on('playback-position', function (data) {
		sendToPeers(socket, 'playback-position', { position: data.position })
	})

	socket.on('playback-status', function (data) {
		sendToPeers(socket, 'play', { playing: data.playing })
	})

	socket.on('buffering', function () {
		sendToPeers(socket, 'buffering', { buffering: true })
	})
}

function sendToPeers(socket, event, data) {
	const roomId = socket.roomId
	console.debug(`${socket.alias} broadcasts event ${event}: ${JSON.stringify(data)}`)
	socket.broadcast.to(roomId).emit(event, data)
}

function sendCurrentStateFromPeer(socket) {
	const peer = findPeerFor(socket)
	if (peer == null) {
		// If no peer is found, no state has to be shared anyways
		return
	}
	peer.emit('state-update')
	peer.once('state-update', state => {
		socket.emit('initial-state', state)
	})
}

function findPeerFor(socket) {
	const roomId = socket.roomId
	const socketsInRoom = io.sockets.adapter.rooms[roomId].sockets
	const socketList = Object.keys(socketsInRoom)
	const peerId = socketList.find(p => p.id != socket.id)
	if (peerId == null)
		return null
	else
		return io.sockets.sockets[peerId]
}

function roomExists(roomId) {
	return io.sockets.adapter.rooms[roomId] != null
}

function getNewRoomId() {
	return uuid.v4()
}