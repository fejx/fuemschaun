const fs = require('fs')
const path = require('path')
const rsa = require('node-rsa')

const ChromeExtension = require('crx')

const keyPath = './secrets/key.pem'
const distDir = './dist'

module.exports = (sourceDir) => {
    assertKeyFile()
    clean()

    const crx = new ChromeExtension({
        codebase: 'http://localhost:8000/myExtension.crx',
        privateKey: fs.readFileSync(keyPath)
    })

    return crx.load(sourceDir)
        .then(crx => crx.pack())
        .then(crxBuffer => {
            const updateXml = crx.generateUpdateXML()

            writeToDist('update.xml', updateXml)
            writeToDist('fuemschaun.crx', crxBuffer)
            console.info(`Saved crx file in ${distDir}`)
        })
        .catch(err => {
            console.error(err)
        })
}

function clean() {
    if (fs.existsSync(distDir))
        fs.rmdirSync(distDir, { recursive: true })
}

function assertKeyFile() {
    const exists = fs.existsSync(keyPath)
    if (exists)
        return
    console.warn('No keyfile found. Generating new one...')
    generateKeyFile(keyPath)
    console.info(`Wrote private key to ${keyPath}`)
}

// Shamelessly stolen from https://github.com/oncletom/crx/blob/master/src/cli.js#L65
function generateKeyFile(keyPath) {
    const key = new rsa({ b: 2048 })
    const privateKey = key.exportKey('pkcs8-private-pem')
    writeFileAndMkdirs(keyPath, privateKey)
}

function writeToDist(fileName, content) {
    const filePath = path.join(distDir, fileName)
    writeFileAndMkdirs(filePath, content)
}

function writeFileAndMkdirs(filePath, content) {
    const dir = path.dirname(filePath)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(filePath, content)
}
