// will be using Webpack Node API
// https://webpack.js.org/api/node/
const webpack = require('webpack')
const path = require('path')
const {printWebpackStates} = require('./utils')

const filename ='./src/index.js'
const babelConfig = require('./babel.config.js')

// https://webpack.js.org/configuration/externals/

// should we just reuse root webpack config?
const webpackOptions = {
  entry: filename,
  output: {
    path: path.resolve('./dist/external'),
    filename: 'bundle.js',
  },
  externals: {
    react: 'react',
    'react-dom': 'reactDom',
    lodash: 'lodash'
  },
  mode: 'development',
  stats: 'verbose',
  // devtool: 'inline-source-map',
  devtool: 'cheap-source-maps',
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

// if you want to build it once
// compiler.run(printWebpackStates)

// if you want to watch and rebuild
compiler.watch(
  {
    aggregateTimeout: 100,
    poll: undefined,
  },
  printWebpackStates
)
