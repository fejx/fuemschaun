import log from 'loglevel'

import * as elementFinder from "./content/element-finder"
import * as connectForm from './content/show-connect-form'
import * as urlManip from './content/url-manipulation'
import * as feed from './content/message-feed'
import { SocketService } from './content/socket-service'
import { VideoWrapper } from './content/video-wrapper'

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome
})()

log.setDefaultLevel(CONFIG.logging.level)

elementFinder.getOrWaitForElement('video', isValidVideo)
    .then(announceFound)

function announceFound(element) {
    connectForm.showConnectForm(username => {
        const sessionId = urlManip.getParam(CONFIG.sessionIdQueryParam) || ''
        log.debug(`Connecting to '${sessionId}' as '${username}'`)
        const service = new SocketService(username, sessionId)
        service.onSessionCreated(sessionId => {
            urlManip.setParam(CONFIG.sessionIdQueryParam, sessionId)
        })
        const wrapper = new VideoWrapper(element)

        wrapper.onPlaybackChanged(event => {
            service.sendPlayOrPause(event.play)
        })
        wrapper.onPositionChanged(event => {
            service.sendPositionChanged(event.currentTime)
        })
        wrapper.onBuffering(event => {
            service.sendBuffering(!event.play)
        })
        service.onPlayOrPause(isPlaying => {
            if (isPlaying)
                wrapper.play()
            else
                wrapper.pause()
        })
        service.onPositionChanged(newPosition => {
            wrapper.jumpTo(newPosition)
        })
        service.onBuffering(isBuffering => {
            feed.info('Someone is buffering')
            if (isBuffering)
                wrapper.pause()
            else
                wrapper.play()
        })
        service.onStateRequested(() => {
            return {
                position: wrapper.getPosition(),
                isPlaying: wrapper.isPlaying,
                createdAt: Date.now()
            }
        })
        service.onInitialState(state => {
            // TODO: Calculate position offset using createAt property
            wrapper.jumpTo(state.position)
            if (state.isPlaying)
                wrapper.play()
            else
                wrapper.pause()
        })
    })
}

function isValidVideo(node) {
    // TODO: Check for duration
    return true
}
