const
  packageCrx = require('./package-crx.js'),
  webpack = require('webpack'),
  config = require("../webpack.config")

delete config.chromeExtensionBoilerplate

console.info('Building...')

webpack(
  config,
  function (err) {
    if (err)
      throw err
    else {
      console.info('Packaging to crx...')
      packageCrx(config.output.path)
    }
  }
)