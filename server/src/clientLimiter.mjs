import socketio from 'socket.io'
import config from 'config'
import log from 'loglevel'

const clientCap = config.get('maximumClients')

/**
 * @param io {socketio.Server}
 */
export function limitClients(io) {
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
    log.error(`Rejected ${socket.id} because limit is exceeded`)
}
