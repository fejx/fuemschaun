import log from 'loglevel'

import { EventEmitter } from 'events'

export class VideoWrapper {
    constructor(element) {
        this.element = element
        this.eventEmitter = new EventEmitter()
        this.shouldSkipNextEvent = false
        this.isPlaying = this.element.autoplay
        this.isCurrentlyBuffering = false

        this.listeners = {
            pause: () => {
                this.isPlaying = false
                const currentTime = this.element.currentTime
                if (this.isBuffering(this.element.buffered, currentTime)) {
                    log.debug('Detected buffering start')
                    this.isCurrentlyBuffering = true
                    this.emitOrSkip('buffering', { play: false, currentTime: currentTime })
                } else {
                    log.debug('Detected pause')
                    this.emitOrSkip('playbackChanged', { play: false, currentTime: currentTime })
                }
            },
            play: () => {
                const currentTime = this.element.currentTime
                this.isPlaying = true
                if (this.isCurrentlyBuffering) {
                    log.debug('Detected buffering end')
                    this.isCurrentlyBuffering = false
                    this.emit('buffering', { play: true, currentTime: currentTime })
                }
                else {
                    log.debug('Detected play')
                    this.emitOrSkip('playbackChanged', { play: true, currentTime: currentTime })
                }
            },
            seeked: () => {
                log.debug('Detected seeked')
                this.isPlaying = true
                this.emitOrSkip('positionChanged', { play: true, currentTime: this.element.currentTime })
            },
            waiting: () => {
                this.isPlaying = false
                this.isCurrentlyBuffering = true
                this.emit('buffering', { play: false, currentTime: this.element.currentTime })
            },
            playing: () => {
                if (!this.isCurrentlyBuffering)
                    return
                this.isPlaying = true
                this.isCurrentlyBuffering = false
                this.emit('buffering', { play: true, currentTime: this.element.currentTime })
            }
        }

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

    emit(name, data) {
        this.eventEmitter.emit(name, data)
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