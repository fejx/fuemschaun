const fs = require('fs')
const path = require('path')
const packageCrx = require('./package-crx')
const webpack = require('webpack')
const config = require("../webpack.config")

delete config.chromeExtensionBoilerplate

const srcDir = config.output.path
const distDir = './dist'

console.info('Building...')

webpack(
  config,
  function (err) {
    if (err)
      throw err
    else {
      console.info('Packaging to crx...')
      clean(distDir)
      packageCrx(srcDir, distDir)
    }
  }
)

function clean(distDir) {
  if (fs.existsSync(distDir))
      removeEverythingIn(distDir)
  else
    fs.mkdirSync(distDir, { recursive: true })
}

function removeEverythingIn(dir) {
  const content = fs.readdirSync(dir)
  content.forEach(file => {
    const joined = path.join(dir, file)
    const isDir = fs.lstatSync(joined).isDirectory()
    if (isDir)
      fs.rmdirSync(joined, { recursive: true })
    else
      fs.unlinkSync(joined)
  })
}