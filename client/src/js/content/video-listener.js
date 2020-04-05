/**
 * 
 * @param {Node} videoElement Video node
 * @param {playbackChangedCallback} onPlaybackChanged 
 * @param {onPositionChanged} onPositionChanged 
 * @param {*} onBuffering 
 */
export function addListeners(videoElement, onPlaybackChanged, onPositionChanged, onBuffering) {
	console.log("in add listeners")
	videoElement.addEventListener('pause', () => {
		console.info('pause event fired')
		let currentTime = videoElement.currentTime
		if (isBuffering(videoElement.buffered, currentTime)) {
			console.info('is buffering')
			onBuffering({ play: false, currentTime: currentTime })
		} else {
			console.info('user paused')
			onPlaybackChanged({ play: false, currentTime: currentTime })
		}
	})
	videoElement.addEventListener('play', () => {
		console.info('play event fired')
		onPlaybackChanged({ play: true, currentTime: videoElement.currentTime })
	})
	videoElement.addEventListener('seeked', () => {
		console.info('seeked event fired')
		onPositionChanged({ play: true, currentTime: videoElement.currentTime })
	})
}

function isBuffering(timeRange, currentTime) {
	let lastTimeRangeIndex = timeRange.length - 1
	return lastTimeRangeIndex < 0 || currentTime > timeRange.end(lastTimeRangeIndex) - 5;
}

/**
 * Event callback when playback changed
 * @callback playbackChangedCallback
 * @param {object} playing True if the new state is playing
 */
/**
 * Event callback when playback changed
 * @callback onPositionChanged 
 * @param {object} playing True if the new state is playing
 */
/**
 * Event callback when playback changed
 * @callback onBuffering 
 * @param {object} playing True if the new state is playing
 */
