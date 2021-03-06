import './show-connect-form.styl'
import { appendNewElement } from './html-building-helper'

const CONTAINER_ID = 'fuemschaun-connect-form-container'

/**
 * @param {connectClickCallback} onConnectClick
 */
export function showConnectForm(onConnectClick) {
    const form = createForm(onConnectClick)
    document.body.prepend(form)
}

/**
 * @callback connectClickCallback
 * @param {string} username
 */

export function removeForm() {
    const form = document.getElementById(CONTAINER_ID)
    if (form != null)
        form.remove()
}

function createForm(onConnectClick) {
    const container = document.createElement('div')
    container.id = CONTAINER_ID

    const closeButton = appendNewElement(container, 'button', e => {
        e.classList.add('fuemschaun-close-button')
        e.textContent = 'x'
        e.addEventListener('click', () => removeForm())
    })

    const confirmAction = () => {
        // TODO: Check if the username is valid
        onConnectClick(usernameInput.value)
        removeForm()
    }

    const usernameInput = appendNewElement(container, 'input', e => {
        e.placeholder = 'Username'
        e.addEventListener('keypress', event => {
            if (event.charCode != 13) // Enter key
                return
            confirmAction()
        })
    })

    const createSessionButton = appendNewElement(container, 'button', e => {
        e.textContent = 'Create Session'
        e.addEventListener('click', confirmAction)
    })

    return container
}
