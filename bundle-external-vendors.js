// will be using Webpack Node API
// https://webpack.js.org/api/node/
const webpack = require('webpack')
const path = require('path')
const {printWebpackStates} = require('./utils')

// https://webpack.js.org/configuration/externals/

// should we just reuse root webpack config?
const webpackOptions = {
  entry: {
    react: path.resolve('./node_modules/react'),
    reactDom: path.resolve('./node_modules/react-dom'),
    lodash: path.resolve('./node_modules/lodash')
  },
  output: {
    path: path.resolve('./dist/external'),
    filename: 'externals-[name].js',
    libraryTarget: 'umd',
    library: '[name]'
  },
  externals: {
    react: 'react',
    'react-dom': 'reactDom',
    lodash: 'lodash'
  },
  mode: 'development',
  stats: 'verbose',
  devtool: 'inline-source-map',
}

const compiler = webpack(webpackOptions)
// if you want to build it once
compiler.run(printWebpackStates)
