const packageCrx = require('./package-crx.js')
const webpack = require('webpack')
const config = require("../webpack.config")

const distDir = './dist'

delete config.chromeExtensionBoilerplate

console.info('Building...')

webpack(
  config,
  function (err) {
    if (err)
      throw err
    else {
      console.info('Packaging to crx...')
      packageCrx(config.output.path, distDir)
    }
  }
)