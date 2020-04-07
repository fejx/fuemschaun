import * as io from 'socket.io-client'
import { EventEmitter } from 'events'

export class SocketService {
    constructor(username, sessionId = '') {
        this.eventEmitter = new EventEmitter()

        this.socket = io.connect(CONFIG.socket.url, {
            query: {
                username: username,
                joinid: sessionId
            }
        })

        this.socket.on('disconnect', message => {
            console.error('Server closed socket:', message)
        })

        if (sessionId == '') {
            this.socket.on('created', message => {
                this.sessionId = message.sessionId
                this.eventEmitter.emit('sessionCreated', this.sessionId)
            })
        }
        else {
            this.sessionId = sessionId
        }
    }

    /**
     * @param {sessionCreated} listener Listener that is fired when a new session has been created
     */
    onSessionCreated(listener) {
        this.eventEmitter.on('sessionCreated', listener)
    }

    close() {
        this.socket.close()
    }
    
    /**
     * @callback sessionCreated
     * @param {string} sessionId Id of the newly created session
     */
}
