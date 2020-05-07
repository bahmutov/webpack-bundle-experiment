// will be using Webpack Node API
// https://webpack.js.org/api/node/
const webpack = require('webpack')
const path = require('path')
const {printWebpackStates} = require('./utils')

const filename ='./src/index.js'
const babelConfig = require('./babel.config.js')

// should we just reuse root webpack config?
const webpackOptions = {
  entry: filename,
  output: {
    path: path.resolve('./dist/watch-together'),
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
    },
  },
  mode: 'development',
  stats: 'verbose',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs|ts|tsx)$/,
        loader: 'babel-loader',
        options: babelConfig,
      },
    ],
  },
}

const compiler = webpack(webpackOptions)
// if you want to watch files for changes
const watching = compiler.watch(
  {
    aggregateTimeout: 100,
    poll: undefined,
  },
  printWebpackStates
)

