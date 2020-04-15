import log from 'loglevel'

import { EventEmitter } from 'events'

export class VideoWrapper {
    constructor(element) {
        this.element = element
        this.eventEmitter = new EventEmitter()
        this.shouldSkipNextEvent = false
        this.isPlaying = this.element.autoplay

        this.listeners = {
            paused: () => {
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
            played: () => {
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

        this.element.addEventListener('pause', this.listeners.paused)
        this.element.addEventListener('play', this.listeners.played)
        this.element.addEventListener('seeked', this.listeners.seeked)
    }

    removeListeners() {
        this.element.removeEventListener('pause', this.listeners.paused)
        this.element.removeEventListener('play', this.listeners.played)
        this.element.removeEventListener('seeked', this.listeners.seeked)
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