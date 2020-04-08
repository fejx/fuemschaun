import { EventEmitter } from 'events'

export class VideoWrapper {
    constructor(element) {
        this.element = element
        this.eventEmitter = new EventEmitter()
        this.shouldSkipNextEvent = false

        this.element.addEventListener('pause', () => {
            console.info('pause event fired')
            const currentTime = this.element.currentTime
            if (this.isBuffering(this.element.buffered, currentTime)) {
                console.info('is buffering')
                this.emitOrSkip('buffering', { play: false, currentTime: currentTime })
            } else {
                console.info('user paused')
                this.emitOrSkip('playbackChanged', { play: false, currentTime: currentTime })
            }
        })
        this.element.addEventListener('play', () => {
            console.info('play event fired')
            this.emitOrSkip('playbackChanged', { play: true, currentTime: this.element.currentTime })
        })
        this.element.addEventListener('seeked', () => {
            console.info('seeked event fired')
            this.emitOrSkip('positionChanged', { play: true, currentTime: this.element.currentTime })
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

    isBuffering() {
        const timeRange = this.element.buffered
        const currentTime = this.element.currentTime
        let lastTimeRangeIndex = timeRange.length - 1
        return lastTimeRangeIndex < 0 || currentTime > timeRange.end(lastTimeRangeIndex) - 5;
    }
}