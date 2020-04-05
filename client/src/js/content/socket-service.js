import * as io from 'socket.io-client'

export class SocketService {
    constructor(username, sessionId = '') {
        this.socket = io.connect('http://localhost:8889', {
            query: {
                username: username,
                joinid: sessionId
            }
        })

        this.socket.on('disconnect', message => {
            console.error('Server closed socket:', message)
        })
    }

    close() {
        this.socket.close()
    }
}
