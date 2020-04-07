import * as elementFinder from "./content/element-finder"
import * as connectForm from './content/show-connect-form'
import * as urlManip from './content/urlManipulation'
import { SocketService } from './content/socket-service'
import { VideoWrapper } from './content/video-wrapper'

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome
})()

elementFinder.getOrWaitForElement('video', isValidVideo)
    .then(announceFound)
    .catch(announceNotFound)

function announceFound(element) {
    connectForm.showConnectForm(username => {
        console.log('Connecting as user', username)
        const sessionId = urlManip.getParam(CONFIG.sessionIdQueryParam) || ''
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
            // TODO: Show message in feed
            if (isBuffering)
                wrapper.pause()
            else
                wrapper.play()
        })
    })
}

function announceNotFound(error) {
    console.error('Not found', error)
}

function isValidVideo(node) {
    // TODO: Check for duration
    return true
}
