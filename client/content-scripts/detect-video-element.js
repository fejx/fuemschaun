window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome
})()

getOrWaitForElement('video', isValidVideo)
    .then(announceFound)
    .catch(announceNotFound)

function announceFound(element) {
    console.log('Found', element)
    const message = {
        name: 'video-element-found',
        found: true
    }
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