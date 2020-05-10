import log from 'loglevel'

import { VideoWrapper } from '../../video-wrapper'
import { appendNewElement } from '../../html-building-helper'
import apiConnectorRaw from '!!raw-loader!./api-connector'

export const HOST = 'www.netflix.com'

export function weave() {
    inject(apiConnectorRaw)

    VideoWrapper.prototype.jumpTo = position => {
        const positionMilliseconds = position * 1000
        window.postMessage({ command: 'jumpTo', position: positionMilliseconds}, '*')
    }

    const originalEnableListeners = VideoWrapper.prototype.enableListeners
    VideoWrapper.prototype.enableListeners = function() {
        const cancelHandler = applyBufferingListener(
            isBuffering => this.emitBuffering(isBuffering)
        )
        this.bufferingListenerCancelHandler = cancelHandler
        this.listeners.waiting = () => {}
        this.listeners.playing = () => {}
        return originalEnableListeners.apply(this, arguments)
    }

    const originalRelease = VideoWrapper.prototype.release
    VideoWrapper.prototype.release = function() {
        this.bufferingListenerCancelHandler()
        return originalRelease.apply(this, arguments)
    }
}

function applyBufferingListener(callback) {
    let lastBufferingStatus = false
    const observationConfig = {
        attributeFilter: ['class'],
        attributes: true
    }
    const container = document.querySelector('.nf-player-container')
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            const spinnerVisible = mutation.target.classList.contains('show-spinner')
            const isBuffering = spinnerVisible
            if (isBuffering == lastBufferingStatus)
                return
            lastBufferingStatus = isBuffering
            callback(isBuffering)
        })
    })
    observer.observe(container, observationConfig)
    return () => observer.disconnect()
}

function inject(script) {
    appendNewElement(document.body, 'script', element => {
        element.textContent = script
        element.setAttribute('type', 'text/javascript')
    })
}