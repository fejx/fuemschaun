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
}

function inject(script) {
    appendNewElement(document.body, 'script', element => {
        element.textContent = script
        element.setAttribute('type', 'text/javascript')
    })
}