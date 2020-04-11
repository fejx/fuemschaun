import http from 'http'
import https from 'https'
import config from 'config'
import { readFileSync } from 'fs'
import path from 'path'

const certConfig = config.get('certificate')
const basePath = process.env.CERTPATH || certConfig ? certConfig.basePath : null

export function createServer() {
	const certConfig = config.get('certificate')
	if (certConfig == null)
		return http.createServer()
	else {
		return https.createServer({
			key: readFile(certConfig.keyFile),
			cert: readFile(certConfig.chainFile),
			ca: readFile(certConfig.overrideCa)
		})
	}
}

function readFile(subPath) {
    if (subPath == null)
        return null
    else {
        const fullPath = path.join(basePath, subPath)
        return readFileSync(fullPath)
    }
}