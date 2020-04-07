import * as elementFinder from "./content/element-finder"
import * as videoListener from "./content/video-listener"
import * as connectForm from './content/show-connect-form'
import { SocketService } from './content/socket-service'

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
        const service = new SocketService(username)
        service.onSessionCreated(sessionId => {
            // TODO: Add session url to current url as query param
            console.log('Session id: ', sessionId)
        })

        videoListener.addListeners(
            element,
            playbackEvent => {
                service.sendPlayOrPause(playbackEvent.play)
            },
            positionChangedEvent => {
                service.sendPositionChanged(positionChangedEvent.currentTime)
            },
            onBufferingEvent => {
                service.sendBuffering(onBufferingEvent.play)
            }
        )
    })
}

function announceNotFound(error) {
    console.error('Not found', error)
}

function isValidVideo(node) {
    // TODO: Check for duration
    return true
}
