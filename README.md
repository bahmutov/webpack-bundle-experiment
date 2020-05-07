# webpack-bundle-experiment

Experimenting with webpack bundling via its [Node API](https://webpack.js.org/api/node/)

## Single combined bundle

Imagine we have a file that has its own code, plus imports React library like [src/index.js](src/index.js)

```js
import React from 'react'
import { add } from './calc'

const Add = () => <div>2 + 3 = {add(2, 3)}</div>
```

We can bundle it using webpack script in [bundle-together.js](bundle-together.js)

```js
// if you want to build it once
compiler.run((err, stats) => {
  if (err) {
    // https://webpack.js.org/api/node/#error-handling
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  const info = stats.toJson('normal');

  if (stats.hasErrors()) {
    console.error(info.errors.join('\n'));
    return
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings.join('\n'));
  }

  console.log(stats.toString({
    colors: true
  }))
})
```

Which produces in 1120ms a single bundle with 81.8 KiB

```
Hash: 2822f05ee7e724e6a394
Version: webpack 4.43.0
Time: 1120ms
Built at: 05/06/2020 9:20:38 PM
    Asset      Size  Chunks             Chunk Names
bundle.js  81.8 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {main} [built]
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {main} [built]
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {main} [built]
[./node_modules/react/cjs/react.development.js] 65.9 KiB {main} [built]
[./node_modules/react/index.js] 189 bytes {main} [built]
[./src/calc.js] 113 bytes {main} [built]
[./src/index.js] 166 bytes {main} [built]
```

## Watching single bundle

You can run Webpack in watch mode using [watch-together.js](watch-together.js) and see significantly faster rebuilds on changing the file. Notice the `[built]` messages - only the changed file `src/calc.js` is rebuilt when I modify it in the editor. This runs in 10-20ms versus the full 1000ms initial build.

```
Hash: d3cbfb59502d572c376c
Version: webpack 4.43.0
Time: 12ms
Built at: 05/06/2020 9:29:42 PM
    Asset      Size  Chunks  Chunk Names
bundle.js  81.8 KiB    main  main
Entrypoint main = bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {main}
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {main}
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {main}
[./node_modules/react/cjs/react.development.js] 65.9 KiB {main}
[./node_modules/react/index.js] 189 bytes {main}
[./src/calc.js] 125 bytes {main} [built]
[./src/index.js] 166 bytes {main}
```

## Vendor bundle

We can automatically split the `node_modules` into separate vendor bundle. In webpack configuration file [bundle-vendor.js](bundle-vendor.js) add

```js
entry: filename,
output: {
  path: path.resolve('./dist/vendor'),
  filename: '[name].bundle.js',
},
// will put node_modules code into separate "vendor" bundle
optimization: {
  splitChunks: {
    chunks: 'all',
  },
}
```

There are two bundles now - one for `src` and another for `vendor`

```
Hash: 1b79bcc1a6389f901773
Version: webpack 4.43.0
Time: 1119ms
Built at: 05/06/2020 9:35:48 PM
                 Asset      Size        Chunks             Chunk Names
        main.bundle.js   7.8 KiB          main  [emitted]  main
vendors~main.bundle.js  76.8 KiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.bundle.js main.bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {vendors~main} [built]
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {vendors~main} [built]
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {vendors~main} [built]
[./node_modules/react/cjs/react.development.js] 65.9 KiB {vendors~main} [built]
[./node_modules/react/index.js] 189 bytes {vendors~main} [built]
[./src/calc.js] 125 bytes {main} [built]
[./src/index.js] 166 bytes {main} [built]
```

## Watching vendor

We can use [watch-vendor.js](watch-vendor.js) script to watch and output vendor bundle.

The initial run finishes in 1100ms

```
Hash: 1b79bcc1a6389f901773
Version: webpack 4.43.0
Time: 1166ms
Built at: 05/06/2020 9:37:35 PM
                 Asset      Size        Chunks             Chunk Names
        main.bundle.js   7.8 KiB          main  [emitted]  main
vendors~main.bundle.js  76.8 KiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.bundle.js main.bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {vendors~main} [built]
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {vendors~main} [built]
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {vendors~main} [built]
[./node_modules/react/cjs/react.development.js] 65.9 KiB {vendors~main} [built]
[./node_modules/react/index.js] 189 bytes {vendors~main} [built]
[./src/calc.js] 125 bytes {main} [built]
[./src/index.js] 166 bytes {main} [built]
```

If we touch the `src/index.js` file

```
Hash: e33046ee14d2fcb64fb7
Version: webpack 4.43.0
Time: 39ms
Built at: 05/06/2020 9:38:26 PM
                 Asset      Size        Chunks             Chunk Names
        main.bundle.js   7.8 KiB          main  [emitted]  main
vendors~main.bundle.js  76.8 KiB  vendors~main             vendors~main
Entrypoint main = vendors~main.bundle.js main.bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {vendors~main}
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {vendors~main}
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {vendors~main}
[./node_modules/react/cjs/react.development.js] 65.9 KiB {vendors~main}
[./node_modules/react/index.js] 189 bytes {vendors~main}
[./src/calc.js] 125 bytes {main}
[./src/index.js] 174 bytes {main} [built]
```
Typically touching a file in `src` rebuilds the bundle in 10-20ms
