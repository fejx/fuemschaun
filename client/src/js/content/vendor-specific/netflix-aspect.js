import log from 'loglevel'

import { VideoWrapper } from '../video-wrapper'

export const HOST = 'www.netflix.com'

export function weave() {
    log.info('Hellouw from netflix aspect')
    VideoWrapper.prototype.jumpTo = position => {
        // TODO: Replace with implementation that does not crash netflix
        log.debug('Ignoring jump to')
    }
}