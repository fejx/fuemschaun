import * as io from 'socket.io-client'
import * as message from './content/message-feed'
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

        this.sessionId = sessionId
        this.socket.on('created', message => {
            if (this.sessionId != null)
                message.info('New session because the old one expired')
            this.sessionId = message.sessionId
            this.eventEmitter.emit('sessionCreated', this.sessionId)
        })
    }

    /**
     * This event is only fired if there was no session id provided or the provided session id was invalid
     * @param {sessionCreated} listener Listener that is fired when a new session has been created
     */
    onSessionCreated(listener) {
        this.eventEmitter.on('sessionCreated', listener)
    }
    /**
     * @callback sessionCreated
     * @param {string} sessionId Id of the newly created session
     */

    /**
     * @param {peerJoined} listener Listener that is fired when a new peer joins the session
     */
    onPeerJoined(listener) {
        this.socket.on('joined', message => {
            listener(message.name)
        })
    }
    /**
     * @callback peerJoined
     * @param {string} name Username of the new peer
     */

    /**
     * @param {peerLeft} listener Listener that is fired when a peer leaves the session
     */
    onPeerLeft(listener) {
        this.socket.on('leave', message => {
            listener(message.name)
        })
    }
    /**
     * @callback peerLeft
     * @param {string} name Username of the peer that left
     */

    /**
     * @param {positionChanged} listener Listener that is fired when someone changed the playback position
     */
    onPositionChanged(listener) {
        this.socket.on('playback-position', message => {
            listener(message.position)
        })
    }
    /**
     * @callback positionChanged
     * @param {number} position New playback position
     */

    /**
     * @param {playOrPause} listener Listener that is fired when someone triggers play or pause
     */
    onPlayOrPause(listener) {
        this.socket.on('play', message => {
            listener(message.playing)
        })
    }
    /**
     * @callback playOrPause
     * @param {boolean} play True if the new state is 'playing'
     */

    /**
     * @param {buffering} listener Listener that is fired when someone is buffering
     */
    onBuffering(listener) {
        this.socket.on('buffering', message => {
            listener(message.buffering)
        })
    }
    /**
     * @callback buffering
     * @param {boolean} buffering True if someone is currently buffering
     */

    /**
     * @param {stateRequested} listener 
     */
    onStateRequested(listener) {
        this.socket.on('state-update', () => {
            const state = listener()
            this.socket.emit('state-update', state)
        })
    }
    /**
     * @callback stateRequested
     * @returns {State} Object containing information about the current state
     */
    /**
     * @typedef {Object} State
     * @property {number} position
     * @property {boolean} isPlaying
     * @property {Date} createdAt
     */

    /**
     * This event is fired after connecting. If there is only one connection, it is not fired.
     * @param {initialState} listener 
     */
    onInitialState(listener) {
        this.socket.on('initial-state', state => {
            listener(state)
        })
    }
    /**
     * @callback initialState
     * @param {State} state The current state of the peers
     */

    /**
     * Announce a playback change to the peers
     * @param {number} newPosition New playback position
     */
    sendPositionChanged(newPosition) {
        this.socket.emit('playback-position', {
            position: newPosition
        })
    }

    /**
     * Announce a play or pause event to the peers
     * @param {boolean} isPlaying True if the new status is 'playing'
     */
    sendPlayOrPause(isPlaying) {
        this.socket.emit('playback-status', {
            playing: isPlaying
        })
    }

    /**
     * Announce a buffering event to the peers
     * @param {boolean} isBuffering 
     */
    sendBuffering(isBuffering) {
        this.socket.emit('buffering', {
            buffering: isBuffering
        })
    }

    close() {
        this.socket.close()
    }
}
