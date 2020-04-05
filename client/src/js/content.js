import * as elementFinder from "./content/element-finder"
import * as videoListener from "./content/video-listener.js"


window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome
})()

elementFinder.getOrWaitForElement('video', isValidVideo)
    .then(announceFound)
    .catch(announceNotFound)

function announceFound(element) {
    console.log('Founda', element)
    const message = {
        name: 'video-element-found',
        found: true
    }
    console.log('add listeners')
    videoListener.addListeners(element, () => {}, () => {}, () => {})
    browser.runtime.sendMessage(message)
}

function announceNotFound(error) {
    console.error('Not found', error)
    const message = {
        name: 'video-element-found',
        found: false,
        reason: error
    }
    browser.runtime.sendMessage(message)
}

function isValidVideo(node) {
    // TODO: Check for duration
    return true
}
