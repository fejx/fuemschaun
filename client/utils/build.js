const
  package = require('./package.js'),
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
      package(config.output.path)
    }
  }
)