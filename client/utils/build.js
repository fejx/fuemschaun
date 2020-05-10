const fs = require('fs')
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
      fs.rmdirSync(distDir, { recursive: true })
}
