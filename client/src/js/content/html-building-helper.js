/**
 * @param {HTMLDivElement} container 
 * @param {string} tag 
 * @param {customizerCallback} customizer 
 */
export function appendNewElement(container, tag, customizer) {
    const newElement = document.createElement(tag)
    customizer(newElement)
    container.appendChild(newElement)
    return newElement
}

/**
 * Predicate for a node
 * @callback customizerCallback
 * @param {HTMLElement} element
 */