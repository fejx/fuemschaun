const WAIT_TIMEOUT_MS = 10 * 1000

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome
})()

const videoElement = findElement()
if (videoElement != null)
    announceVideoElementFound(videoElement)
else {
    waitForElement().then(element => {
        announceVideoElementFound(element)
    }).catch(error => {
        console.error('No video element found', error)
    })
}

function getOrWaitForElement() {
    const element = findElement()
    if (element != null)
        return instantResolvePromise(element)
    // No video element found on page, waiting for one to appear
    return waitForElement()
}

function findElement() {
    const videos = document.getElementsByTagName('video')
    const videoArray = indexableToArray(videos)
    return videoArray.find(isValidVideoElement)
}

function waitForElement() {
    return new Promise((resolve, reject) => {
        let resolved = false
        const body = document.getElementsByTagName('body')[0]

        const observationConfig = {
            childList: true,
            subtree: true
        }

        const observer = new MutationObserver((mutations, observer) => {
            const addedNodes = mutations
                .filter(mutation => mutation.type == 'childList')
                .flatMap(mutation => indexableToArray(mutation.addedNodes))
            const videoElement = findMatchingElementIn(addedNodes)
            if (videoElement != null) {
                resolved = true
                observer.disconnect()
                resolve(videoElement)
            }
        })

        setTimeout(() => {
            if (!resolved) {
                resolved = true
                observer.disconnect()
                reject('Timeout exceeded')
            }
        }, WAIT_TIMEOUT_MS)

        observer.observe(body, observationConfig)
    })
}

function findMatchingElementIn(nodes) {
    if (nodes.length == 0)
        return null
    const firstLevel = nodes.find(isValidVideoElement)
    if (firstLevel != null)
        return firstLevel
    const children = nodes.flatMap(node => indexableToArray(node.childNodes))
    return findMatchingElementIn(children)
}

/**
 * Converts any object with a length property and an index operator to an array
 */
function indexableToArray(indexable) {
    // Stolen from stackoverflow.com/questions/3199588/fastest-way-to-convert-javascript-nodelist-to-array
    var array = [];
    for (var i = indexable.length; i--; array.unshift(indexable[i]))
        ;
    return array
}

function announceVideoElementFound(element) {
    console.log('Found video element', element)
}

function isValidVideoElement(element) {
    const name = element.tagName
    if (name == null)
        return false
    return name.toLowerCase() == 'video'
}

function instantResolvePromise(object) {
    return new Promise((resolve, reject) => {
        resolve(object)
    })
}