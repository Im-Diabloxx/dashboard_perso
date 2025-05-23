'use strict'

require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

const HtmlWebpackPlugin = require('html-webpack-plugin');
const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const { createProxyMiddleware } = require('http-proxy-middleware')
const webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

const port = process.env.PORT || config.dev.port
const autoOpenBrowser = !!config.dev.autoOpenBrowser
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath
  // Removed the 'quiet' option as it's no longer valid
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false
})

// Use Webpack 5 hook system
compiler.hooks.compilation.tap('HtmlWebpackPluginAfterEmit', (compilation) => {
  HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(
    'HtmlWebpackPluginAfterEmit',
    (data, cb) => {
      hotMiddleware.publish({ action: 'reload' })
      cb()
    }
  )
})

app.use(hotMiddleware)

Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(createProxyMiddleware(context, options))
})

app.use(require('connect-history-api-fallback')())

app.use(devMiddleware)

const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

let _resolve
const readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

const server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
