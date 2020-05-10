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
      packageCrx(srcDir, distDir)
    }
  }
)