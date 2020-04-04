window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})()

const app = new Vue({
    el: 'main',
    data: {
        state: 'searching'
    },
    methods: {
        newSession: () => {
            // TODO
        }
    }
})

getActiveTab().then((tab) => {
    browser.tabs.executeScript(
        tab.id,
        { file: 'content-scripts/detect-video-element.js' }
    )
    browser.runtime.onMessage.addListener((message, sender) => {
        if (message.name == 'video-element-found') {
            if (message.found)
                app.state = 'found'
            else
                app.state = 'not-found'
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