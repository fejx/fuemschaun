import { EventEmitter } from 'events'

export class VideoWrapper {
    constructor(element) {
        this.element = element
        this.eventEmitter = new EventEmitter()

        this.element.addEventListener('pause', () => {
            console.info('pause event fired')
            const currentTime = this.element.currentTime
            if (this.isBuffering(this.element.buffered, currentTime)) {
                console.info('is buffering')
                this.eventEmitter.emit('buffering', { play: false, currentTime: currentTime })
            } else {
                console.info('user paused')
                this.eventEmitter.emit('playbackChanged', { play: false, currentTime: currentTime })
            }
        })
        this.element.addEventListener('play', () => {
            console.info('play event fired')
            this.eventEmitter.emit('playbackChanged', { play: true, currentTime: this.element.currentTime })
        })
        this.element.addEventListener('seeked', () => {
            console.info('seeked event fired')
            this.eventEmitter.emit('positionChanged', { play: true, currentTime: this.element.currentTime })
        })
    }

    play() {
        this.element.play()
    }

    pause() {
        this.element.pause()
    }

    jumpTo(position) {
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