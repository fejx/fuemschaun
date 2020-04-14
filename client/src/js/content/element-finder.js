/**
 * 
 * @param tagName {string} Name of the tag that the matching element should have (used to speed up initial search in the document).
 * @param predicate {nodePredicate} Predicate that should be fulfilled for the element.
 */
export function getOrWaitForElement(tagName, predicate) {
    const element = findElement(tagName, predicate)
    if (element != null)
        return instantResolvePromise(element)
    // No matching element found on page, waiting for one to appear
    return waitForElement(tagName, predicate)
}

/**
 * Predicate for a node
 * @callback nodePredicate
 * @param {Node} node
 * @returns {boolean} true if the node matches the predicate
 */

function findElement(tagName, predicate) {
    const elements = document.getElementsByTagName(tagName)
    const elementArray = indexableToArray(elements)
    return elementArray.find(predicate)
}

function waitForElement(tagName, predicate) {
    return new Promise((resolve, reject) => {
        let resolved = false

        const stopObserving = observeForNewElements(tagName, element => {
            if (!predicate(element))
                return
            resolved = true
            stopObserving()
            resolve(element)
        })

        setTimeout(() => {
            if (!resolved) {
                resolved = true
                stopObserving()
                reject('Timeout exceeded')
            }
        }, CONFIG.elementFinder.waitTimeoutMs)
    })
}

function observeForNewElements(tagName, foundCallback) {
    const observationConfig = {
        childList: true,
        subtree: true
    }
    const observer = new MutationObserver((mutations, observer) => {
        const addedNodes = mutations
            .filter(mutation => mutation.type == 'childList')
            .flatMap(mutation => indexableToArray(mutation.addedNodes))
        const matchingElement = findMatchingElementIn(
            addedNodes, tagName
        )
        if (matchingElement != null) {
            foundCallback(matchingElement)
        }
    })
    observer.observe(document.body, observationConfig)
    return () => { observer.disconnect() }
}

function findMatchingElementIn(nodes, tagName) {
    if (nodes.length == 0)
        return null
    const firstLevel = nodes.find(node => isOfTag(node, tagName))
    if (firstLevel != null)
        return firstLevel
    const children = nodes.flatMap(node => indexableToArray(node.childNodes))
    return findMatchingElementIn(children, tagName)
}

function isOfTag(node, tagName) {
    const name = node.tagName
    if (name == null)
        return false
    return name.toLowerCase() == tagName
}

function instantResolvePromise(object) {
    return new Promise(resolve => {
        resolve(object)
    })
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