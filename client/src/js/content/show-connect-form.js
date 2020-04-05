import './show-connect-form.css'

/**
 * @param {connectClickCallback} onConnectClick
 */
export function showConnectForm(onConnectClick) {
    const form = createForm(onConnectClick)
    const body = document.getElementsByTagName('body')[0]
    body.prepend(form)
}

/**
 * @callback connectClickCallback
 * @param {string} username
 * @returns {string} null if successful, error message if error
 */

function createForm(onConnectClick) {
    const container = document.createElement('div')
    container.id = 'fuemschaun-container'

    const closeButton = appendNewElement(container, 'button', e => {
        e.classList.add('fuemschaun-close-button')
        e.textContent = 'x'
        e.addEventListener('click', () => removeForm())
    })

    const usernameInput = appendNewElement(container, 'input', e => {
        e.placeholder = 'Username'
    })

    const createSessionButton = appendNewElement(container, 'button', e => {
        e.textContent = 'Create Session'
        e.addEventListener('click', () => {
            // TODO: Check if the username is valid
            const errorMessage = onConnectClick(usernameInput.value)
            if (!errorMessage)
                removeForm()
            else {
                // TODO: Show error message in UI
                console.error('Could not create session:', errorMessage)
            }
        })
    })

    return container
}

function removeForm() {
    const form = document.getElementById('fuemschaun-container')
    form.remove()
}

/**
 * @param {HTMLDivElement} container 
 * @param {string} tag 
 * @param {customizerCallback} customizer 
 */
function appendNewElement(container, tag, customizer) {
    const newElement = document.createElement(tag)
    customizer(newElement)
    container.appendChild(newElement)
    return newElement
}

/**
 * Predicate for a node
 * @callback customizerCallback
 * @param {HTMLElement} element
 */