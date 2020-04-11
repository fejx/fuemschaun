import Url from 'url-parse'

export function setParam(key, value) {
    const url = new Url(document.location.href, true)
    url.query[key] = value
    updateCurrentUrl(url.toString())
}

export function getParam(key) {
    const url = new Url(document.location.href, true)
    return url.query[key]
}

function updateCurrentUrl(newUrl) {
    window.history.pushState(
        {},
        document.title,
        newUrl
    )
}