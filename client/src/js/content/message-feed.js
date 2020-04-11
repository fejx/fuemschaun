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
    consoleLogAccordingTo(type, message)
}

function consoleLogAccordingTo(type, message) {
    switch(type) {
        case messageType.info:
        case messageType.success:
            console.info(message)
            return
        case messageType.warning:
            console.warn(message)
            return
        case messageType.error:
            console.error(message)
            return
    }
}
