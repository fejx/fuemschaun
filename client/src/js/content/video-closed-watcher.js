/**
 * Calls the callback if the video element was closed.
 * This is not always trivial, because most single page applications
 * do not actually remove the video element.
 * Instead, they reuse the video element for other purposes.
 * For obvious reasons, the event fires only *once*.
 * 
 * @param {HTMLVideoElement} element 
 * @param {videoClosed} callback
 * @returns {cancellationToken} Handler to cancel listening
 */
export function onVideoClosed(element, callback) {
    return observeUntilAttributesChanged(
        element,
        [ 'src' ],
        callback
    )
}

/**
 * Called when the video is closed.
 * @callback videoClosed
 */

function observeUntilAttributesChanged(element, attributes, callback) {
    const observationConfig = {
        attributes: true,
        attributeFilter: attributes
    }
    const observer = new MutationObserver(() => {
        observer.disconnect()
        callback()
    })
    observer.observe(element, observationConfig)
    const cancellationToken = () => observer.disconnect()
    return cancellationToken
}