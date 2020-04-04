window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome
})()

getOrWaitForElement('video', isValidVideo)
    .then(announceVideoElementFound)
    .catch(error => console.error('No video element found:', error))

function announceVideoElementFound(element) {
    console.log('Found video element', element)
}

function isValidVideo(node) {
    // TODO: Check for duration
    return true
}