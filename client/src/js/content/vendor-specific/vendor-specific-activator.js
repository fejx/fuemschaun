import Url from 'url-parse'
import { aspects } from './aspects'
import log from 'loglevel'

export default function findAndActivateVendorSpecificAdvices() {
    const host = getCurrentHost()
    const aspect = getMatchingAspectFor(host)
    if (aspect != null) {
        log.debug(`Weaving aspects for ${host}`)
        aspect()
    } else
        log.debug(`No aspects found for ${host}`)
}

function getCurrentHost() {
    const currentUrlString = window.location.href
    const currentUrl = new Url(currentUrlString)
    return currentUrl.host
}

function getMatchingAspectFor(host) {
    return aspects[host]
}