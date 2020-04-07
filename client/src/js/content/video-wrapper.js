export class VideoWrapper {
    constructor(element) {
        this.element = element
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
}