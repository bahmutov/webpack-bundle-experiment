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
    path: path.resolve('./dist/together'),
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
    },
  },
  mode: 'development',
  stats: 'verbose',
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
// const watching = compiler.watch(
//   {
//     // Example watchOptions
//     aggregateTimeout: 300,
//     poll: undefined,
//   },
//   (err, stats) => {
//     console.log('*******')
//     console.log(new Date())
//     console.log('*******')
//     if (err) {
//       console.error(err)
//     } else {
//       console.log(stats.toJson('verbose'))
//     }
//   },
// )

// if you want to build it once
compiler.run(printWebpackStates)
