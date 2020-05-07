const webpack = require('webpack')
const path = require('path')
const {printWebpackStates} = require('./utils')

const filename ='./src/index.js'
const babelConfig = require('./babel.config.js')

// should we just reuse root webpack config?
const webpackOptions = {
  entry: filename,
  output: {
    path: path.resolve('./dist/vendor'),
    filename: '[name].bundle.js',
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
  // will put node_modules code into separate "vendor" bundle
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}

const compiler = webpack(webpackOptions)
// if you want to build it once
compiler.run(printWebpackStates)
