window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})()

const app = new Vue({
    el: 'main'
})

const statusText = document.getElementById('status-text')

getActiveTab().then((tab) => {
    browser.tabs.executeScript(
        tab.id,
        { file: 'content-scripts/detect-video-element.js' }
    )
    browser.runtime.onMessage.addListener((message, sender) => {
        if (message.name == 'video-element-found') {
            if (message.found)
                statusText.innerHTML = 'Video found'
            else
                statusText.innerHTML = 'No video found'
        }
    })
})

function getActiveTab() {
    return new Promise((resolve, reject) => {
        browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0])
        })
    })
}