import './message-feed.styl'
import { appendNewElement } from './html-building-helper'

const CONTAINER_CLASS = 'fuemschaun-message-feed-container'
const CONTAINER = createContainer()

export function mount() {
    document.body.prepend(CONTAINER)
}

export function unmount() {
    setTimeout(() => {
        document.body.removeChild(CONTAINER)
    }, CONFIG.messageFeed.visibleDurationMs)
}

/**
 * @enum {string}
 */
export const messageType = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error'
}

/**
 * @param {string} message 
 */
export function info(message) {
    show(messageType.info, message)
}

/**
 * @param {string} message 
 */
export function success(message) {
    show(messageType.success, message)
}

/**
 * @param {string} message 
 */
export function warning(message) {
    show(messageType.warning, message)
}

/**
 * @param {string} message 
 */
export function error(message) {
    show(messageType.error, message)
}

/**
 * @param {messageType} type 
 * @param {string} message 
 */
export function show(type, message) {
    addMessageToContainer(type, message)
}

function createContainer() {
    const container = document.createElement('div')
    container.classList.add(CONTAINER_CLASS)
    return container
}

function addMessageToContainer(type, message) {
    const element = appendNewElement(CONTAINER, 'div', element => {
        element.classList.add('fuemschaun-message')
        const typeClassName = getClassNameFromType(type)
        element.classList.add(typeClassName)
        appendNewElement(element, 'span', span => {
            span.innerText = message
        })
    })
    setTimeout(() => {
        CONTAINER.removeChild(element)
    }, CONFIG.messageFeed.visibleDurationMs)
}

function getClassNameFromType(type) {
    return `fuemschaun-${type}`   
}