/**
 * This file gets injected directly into the page.
 * Usually, extensions run in a sandbox, making them
 * isolated from the page context.
 * In this file, the netflix api can be accessed directly.
 */
function onMessage(message) {
    const data = message.data
    if (data == null) return
    switch (data.command) {
        case 'jumpTo':
            onJumpTo(data)
            return
    }
}
window.addEventListener('message', onMessage, true)

function onJumpTo(data) {
    getPlayerInstance().seek(data.position)
}
function getApi() {
    return window.netflix.appContext.state.playerApp.getAPI()
}
function getPlayerInstance() {
    const playerApi = getApi().videoPlayer
    const sessionId = playerApi.getAllPlayerSessionIds()[0]
    return playerApi.getVideoPlayerBySessionId(sessionId)
}
