import socketio from 'socket.io'

/**
 * @param io {socketio.Server}
 * @param clientCap {number} max number of clients
 */
export function limitTo(io, clientCap) {
    let numberOfClients = 0
    io.on('connection', socket => {
        if (numberOfClients >= clientCap)
            rejectConnection(socket)
        else {
            numberOfClients++
            socket.on('disconnect', _ => {
                numberOfClients--
            })
        }
    })
}

function rejectConnection(socket) {
    socket.emit('disconnect', 'Client limit exceeded')
    socket.disconnect()
    console.error(`Rejected ${socket.id} because limit is exceeded`)
}
