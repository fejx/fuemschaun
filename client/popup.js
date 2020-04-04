window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})()

const statusText = document.getElementById('status-text')

// getActiveTab().then((tab) => {
//     browser.tabs.executeScript(
//         tab.id,
//         { file: 'content-script.js' }
//     )
//     browser.runtime.onMessage.addListener((message, sender) => {
//         if (message.name == 'video-element') {
//             if (message.found)
//                 statusText.innerHTML = 'Video found'
//             else
//                 statusText.innerHTML = 'No video found'
//         }
//     })
// })

// function getActiveTab() {
//     return new Promise((resolve, reject) => {
//         browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             resolve(tabs[0])
//         })
//     })
// }