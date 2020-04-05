import * as elementFinder from "./content/element-finder";
import * as connectForm from './content/show-connect-form'

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome
})()

elementFinder.getOrWaitForElement('video', isValidVideo)
    .then(announceFound)
    .catch(announceNotFound)

function announceFound(element) {
    connectForm.showConnectForm(username => {
        console.log('Simulating connecting as user', username)
        return null // No error
    })
}

function announceNotFound(error) {
    console.error('Not found', error)
}

function isValidVideo(node) {
    // TODO: Check for duration
    return true
}