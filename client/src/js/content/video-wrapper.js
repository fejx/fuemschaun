import log from 'loglevel'

import { EventEmitter } from 'events'

export class VideoWrapper {
    constructor(element) {
        this.element = element
        this.eventEmitter = new EventEmitter()
        this.eventSkipCount = 0
        this.isPlaying = this.element.autoplay
        this.isCurrentlyBuffering = false

        this.listeners = {
            pause: () => {
                this.isPlaying = false
                const currentTime = this.element.currentTime
                this.emitOrSkip('playbackChanged', { play: false, currentTime: currentTime })
            },
            play: () => {
                const currentTime = this.element.currentTime
                this.isPlaying = true
                this.emitOrSkip('playbackChanged', { play: true, currentTime: currentTime })
            },
            // Buffer detection for well behaved video elements
            seeked: () => {
                this.isPlaying = true
                this.emitOrSkip('positionChanged', { play: true, currentTime: this.element.currentTime })
            },
            waiting: () => {
                this.isPlaying = false
                this.isCurrentlyBuffering = true
                this.emitBuffering(true)
            },
            playing: () => {
                if (!this.isCurrentlyBuffering)
                    return
                this.isPlaying = true
                this.isCurrentlyBuffering = false
                this.emitBuffering(false)
            }
        }

        this.enableListeners()
    }

    enableListeners() {
        Object.keys(this.listeners).forEach(eventName => {
            const listener = this.listeners[eventName]
            this.element.addEventListener(eventName, listener)
        })
    }

    release() {
        Object.keys(this.listeners).forEach(eventName => {
            const listener = this.listeners[eventName]
            this.element.removeEventListener(eventName, listener)
        })
    }

    emitAlways(name, data) {
        log.debug(`Detected ${name} (playing: ${data.play})`)
        this.eventEmitter.emit(name, data)
    }

    emitOrSkip(name, data) {
        if (this.eventSkipCount > 0) {
            log.debug(`Skipped ${name}-event`)
            this.eventSkipCount--
        } else
            this.emitAlways(name, data)
    }

    skipNextEvent() {
        this.eventSkipCount++
    }

    play() {
        this.skipNextEvent()
        this.element.play()
    }

    pause() {
        this.skipNextEvent()
        this.element.pause()
    }

    jumpTo(position) {
        this.skipNextEvent()
        this.element.currentTime = position
    }

    onBuffering(listener) {
        this.eventEmitter.on('buffering', listener)
    }

    onPlaybackChanged(listener) {
        this.eventEmitter.on('playbackChanged', listener)
    }

    onPositionChanged(listener) {
        this.eventEmitter.on('positionChanged', listener)
    }

    emitBuffering(isBuffering) {
        this.emitAlways('buffering', { play: !isBuffering, currentTime: this.element.currentTime })
    }

    getPosition() {
        return this.element.currentTime
    }

    getIsPlaying() {
        return this.isPlaying
    }
}