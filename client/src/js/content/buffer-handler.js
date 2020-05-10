export class BufferHandler {
    constructor(videoWrapper, socketService, messageFeed) {
        this.videoWrapper = videoWrapper
        this.socketService = socketService
        this.messageFeed = messageFeed
        this.bufferingClients = []
        videoWrapper.onBuffering(event => {
            socketService.sendBuffering(!event.play)
            this.bufferStateUpdated()
        })
        socketService.onBuffering(newBufferState => {
            this.bufferingClients = newBufferState
            this.bufferStateUpdated()
        })
    }

    bufferStateUpdated() {
        const isAnyoneBuffering = this.bufferingClients.length > 0
        const isSelfBuffering = this.videoWrapper.isCurrentlyBuffering
        this.reactToState(isAnyoneBuffering, isSelfBuffering)
    }

    reactToState(isAnyoneBuffering, isSelfBuffering) {
        if (isSelfBuffering) {
            if (isAnyoneBuffering)
                this.announceBuffering()
            else // I am buffering, but others are not
                this.messageFeed.info('Others are waiting')
        } else { // I am not buffering
            if (isAnyoneBuffering) {
                this.videoWrapper.pause()
                this.announceBuffering()
            } else { // Neither me or anyone else is buffering
                this.messageFeed.info('Buffering finished')
                this.videoWrapper.play()
            }
        }
    }

    announceBuffering() {
        const message = this.getBufferingMessage()
        this.messageFeed.info(message)
    }

    getBufferingMessage() {
        const bufferingClients = this.bufferingClients
        const onlyOne = bufferingClients.length == 1

        if (onlyOne)
            return `${bufferingClients[0]} is buffering...`
        else {
            const readableList = this.joinToReadableList(bufferingClients)
            return `${readableList} are buffering...`
        }
    }

    joinToReadableList(list) {
        const last = list.slice(-1)
        const rest = list.slice(0, list.length - 1)
        const commaSeparatedPart = rest.join(', ')
        return `${commaSeparatedPart} and ${last}`
    }
}