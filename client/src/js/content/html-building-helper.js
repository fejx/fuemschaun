/**
 * @param {HTMLDivElement} container 
 * @param {string} tag 
 * @param {customizerCallback} customizer 
 */
export function appendNewElement(container, tag, customizer) {
    const newElement = createWithCustomizer(tag, customizer)
    container.appendChild(newElement)
    return newElement
}

/**
 * @param {HTMLDivElement} container 
 * @param {string} tag 
 * @param {customizerCallback} customizer 
 */
export function prependNewElement(container, tag, customizer) {
    const newElement = createWithCustomizer(tag, customizer)
    // This works even if there is no child
    container.insertBefore(newElement, container.firstChild)
    return newElement
}

/**
 * Predicate for a node
 * @callback customizerCallback
 * @param {HTMLElement} element
 */

function createWithCustomizer(tag, customizer) {
    const newElement = document.createElement(tag)
    customizer(newElement)
    return newElement
}