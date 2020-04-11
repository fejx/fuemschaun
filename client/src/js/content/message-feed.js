/**
 * @enum {number}
 */
export const level = {
    DEBUG: 0,
    INFO: 1,
    WARNING: 2,
    ERROR: 4
}

/**
 * @param {string} message 
 */
export function debug(message, ...objects) {
    show(level.DEBUG, message, ...objects)
}

/**
 * @param {string} message 
 */
export function info(message, ...objects) {
    show(level.INFO, message, ...objects)
}

/**
 * @param {string} message 
 */
export function warning(message, ...objects) {
    show(level.WARNING, message, ...objects)
}

/**
 * @param {string} message 
 */
export function error(message, ...objects) {
    show(level.ERROR, message, ...objects)
}

/**
 * @param {level} level 
 * @param {string} message 
 */
export function show(level, message, ...objects) {
    if (shouldNotShow(level))
        return
    consoleLogAccordingTo(level, message, objects)
}

function consoleLogAccordingTo(level, message, objects) {
    switch (level) {
        case 0:
            console.debug(message, ...objects)
            return
        case 1:
            console.info(message, ...objects)
            return
        case 2:
            console.warn(message, ...objects)
            return
        case 3:
            console.error(message, ...objects)
            console.trace()
            return
        default:
            console.log(message, ...objects)
            return
    }
}

function shouldNotShow(level) {
    return !shouldShow(level)
}

function shouldShow(level) {
    return level >= CONFIG.messageLevel
}