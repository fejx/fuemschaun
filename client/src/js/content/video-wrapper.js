import log from 'loglevel'

import { EventEmitter } from 'events'

export class VideoWrapper {
    constructor(element) {
        this.element = element
        this.eventEmitter = new EventEmitter()
        this.shouldSkipNextEvent = false
        this.isPlaying = this.element.autoplay

        this.listeners = {
            pause: () => {
                this.isPlaying = false
                const currentTime = this.element.currentTime
                if (this.isBuffering(this.element.buffered, currentTime)) {
                    log.debug('Detected buffering')
                    this.emitOrSkip('buffering', { play: false, currentTime: currentTime })
                } else {
                    log.debug('Detected pause')
                    this.emitOrSkip('playbackChanged', { play: false, currentTime: currentTime })
                }
            },
            play: () => {
                log.debug('Detected play')
                this.isPlaying = true
                this.emitOrSkip('playbackChanged', { play: true, currentTime: this.element.currentTime })
            },
            seeked: () => {
                log.debug('Detected seeked')
                this.isPlaying = true
                this.emitOrSkip('positionChanged', { play: true, currentTime: this.element.currentTime })
            }
        }

        Object.keys(this.listeners).forEach(eventName => {
            const listener = this.listeners[eventName]
            this.element.addEventListener(eventName, listener)
        })
    }

    removeListeners() {
        Object.keys(this.listeners).forEach(eventName => {
            const listener = this.listeners[eventName]
            this.element.removeEventListener(eventName, listener)
        })
    }

    emitOrSkip(name, data) {
        if (this.shouldSkipNextEvent)
            this.shouldSkipNextEvent = false
        else
            this.eventEmitter.emit(name, data)
    }

    skipNextEvent() {
        this.shouldSkipNextEvent = true
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

    getPosition() {
        return this.element.currentTime
    }

    getIsPlaying() {
        return this.isPlaying
    }

    isBuffering() {
        const timeRange = this.element.buffered
        const currentTime = this.element.currentTime
        let lastTimeRangeIndex = timeRange.length - 1
        return lastTimeRangeIndex < 0 || currentTime > timeRange.end(lastTimeRangeIndex) - 5;
    }
}