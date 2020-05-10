import log from 'loglevel'

let broadcast = () => {
    throw new Error('No broadcast function defined')
}
let io = null

export function setBroadcastFunction(newBroadcastFunction) {
    broadcast = newBroadcastFunction
}

export function setIoInstance(newIo) {
    io = newIo
}

export function changedFor(socket, buffering) {
    const bufferState = getBufferStateForSocket(socket)
    if (buffering)
        addTo(socket, bufferState)
    else
        removeFrom(socket, bufferState)
    const aliases = bufferState.map(socket => socket.alias)
    broadcast(socket, 'buffering', { state: aliases })
}

function getBufferStateForSocket(socket) {
    const roomId = socket.roomId
    const room = io.to(roomId)
    return getOrCreateBufferStateForRoom(room)
}

function addTo(socket, bufferState) {
    bufferState.push(socket)
}

function removeFrom(socket, bufferState) {
    const index = bufferState.indexOf(socket)
    bufferState.splice(index, 1)
}

function getOrCreateBufferStateForRoom(room) {
    let bufferState = room.bufferState
    if (bufferState == null) {
        bufferState = []
        room.bufferState = bufferState
    }
    return bufferState
}