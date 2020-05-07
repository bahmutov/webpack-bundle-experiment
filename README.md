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
$ node ./bundle-together.js
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

## Increasing the vendor bundle size

Let's add ReactDOM and import it. This makes a huge difference for initial bundling, but almost no difference for watching

### Bundle together

```
$ node ./bundle-together.js
[BABEL] Note: The code generator has deoptimised the styling of /Users/gleb/git/webpack-bundle-experiment/node_modules/react-dom/cjs/react-dom.development.js as it exceeds the max of 500KB.
*******
2020-05-07T01:55:31.631Z
*******
Hash: 60a10fbf87873207ec87
Version: webpack 4.43.0
Time: 2909ms
Built at: 05/06/2020 9:55:31 PM
    Asset     Size  Chunks             Chunk Names
bundle.js  838 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {main} [built]
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {main} [built]
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {main} [built]
[./node_modules/react-dom/cjs/react-dom.development.js] 709 KiB {main} [built]
[./node_modules/react-dom/index.js] 1.32 KiB {main} [built]
[./node_modules/react/cjs/react.development.js] 65.9 KiB {main} [built]
[./node_modules/react/index.js] 189 bytes {main} [built]
[./node_modules/scheduler/cjs/scheduler-tracing.development.js] 9.91 KiB {main} [built]
[./node_modules/scheduler/cjs/scheduler.development.js] 26.5 KiB {main} [built]
[./node_modules/scheduler/index.js] 197 bytes {main} [built]
[./node_modules/scheduler/tracing.js] 213 bytes {main} [built]
[./src/calc.js] 125 bytes {main} [built]
[./src/index.js] 209 bytes {main} [built]
```

### Watching together

```
$ node ./watch-together.js
....
edit the file and save

Hash: ce4f2c2ff6d84564079e
Version: webpack 4.43.0
Time: 14ms
Built at: 05/06/2020 9:56:17 PM
    Asset     Size  Chunks  Chunk Names
bundle.js  838 KiB    main  main
Entrypoint main = bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {main}
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {main}
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {main}
[./node_modules/react-dom/cjs/react-dom.development.js] 709 KiB {main}
[./node_modules/react-dom/index.js] 1.32 KiB {main}
[./node_modules/react/cjs/react.development.js] 65.9 KiB {main}
[./node_modules/react/index.js] 189 bytes {main}
[./node_modules/scheduler/cjs/scheduler-tracing.development.js] 9.91 KiB {main}
[./node_modules/scheduler/cjs/scheduler.development.js] 26.5 KiB {main}
[./node_modules/scheduler/index.js] 197 bytes {main}
[./node_modules/scheduler/tracing.js] 213 bytes {main}
[./src/calc.js] 125 bytes {main}
[./src/index.js] 208 bytes {main} [built]
```

## Adding source map

If we add inline source map to the bundle with Webpack option

```js
devtool: 'inline-source-map',
```

Then we get huge bundle size increase and time increase

```
$ node ./bundle-together.js
[BABEL] Note: The code generator has deoptimised the styling of /Users/gleb/git/webpack-bundle-experiment/node_modules/react-dom/cjs/react-dom.development.js as it exceeds the max of 500KB.
*******
2020-05-07T02:08:42.478Z
*******
Hash: f69ed00f16f805901240
Version: webpack 4.43.0
Time: 4661ms
Built at: 05/06/2020 10:08:42 PM
    Asset      Size  Chunks             Chunk Names
bundle.js  2.96 MiB    main  [emitted]  main
Entrypoint main = bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {main} [built]
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {main} [built]
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {main} [built]
[./node_modules/react-dom/cjs/react-dom.development.js] 709 KiB {main} [built]
[./node_modules/react-dom/index.js] 1.32 KiB {main} [built]
[./node_modules/react/cjs/react.development.js] 65.9 KiB {main} [built]
[./node_modules/react/index.js] 189 bytes {main} [built]
[./node_modules/scheduler/cjs/scheduler-tracing.development.js] 9.91 KiB {main} [built]
[./node_modules/scheduler/cjs/scheduler.development.js] 26.5 KiB {main} [built]
[./node_modules/scheduler/index.js] 197 bytes {main} [built]
[./node_modules/scheduler/tracing.js] 213 bytes {main} [built]
[./src/calc.js] 125 bytes {main} [built]
[./src/index.js] 208 bytes {main} [built]
```

Watching the bundle:

```
First load

$ node ./watch-together.js
[BABEL] Note: The code generator has deoptimised the styling of /Users/gleb/git/webpack-bundle-experiment/node_modules/react-dom/cjs/react-dom.development.js as it exceeds the max of 500KB.
*******
2020-05-07T02:10:09.242Z
*******
Hash: f69ed00f16f805901240
Version: webpack 4.43.0
Time: 3705ms
Built at: 05/06/2020 10:10:09 PM
    Asset      Size  Chunks             Chunk Names
bundle.js  2.96 MiB    main  [emitted]  main
Entrypoint main = bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {main} [built]
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {main} [built]
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {main} [built]
[./node_modules/react-dom/cjs/react-dom.development.js] 709 KiB {main} [built]
[./node_modules/react-dom/index.js] 1.32 KiB {main} [built]
[./node_modules/react/cjs/react.development.js] 65.9 KiB {main} [built]
[./node_modules/react/index.js] 189 bytes {main} [built]
[./node_modules/scheduler/cjs/scheduler-tracing.development.js] 9.91 KiB {main} [built]
[./node_modules/scheduler/cjs/scheduler.development.js] 26.5 KiB {main} [built]
[./node_modules/scheduler/index.js] 197 bytes {main} [built]
[./node_modules/scheduler/tracing.js] 213 bytes {main} [built]
[./src/calc.js] 125 bytes {main} [built]
[./src/index.js] 208 bytes {main} [built]

Edit file
Hash: a5199f548e90a407fb7c
Version: webpack 4.43.0
Time: 941ms
Built at: 05/06/2020 10:10:36 PM
    Asset      Size  Chunks             Chunk Names
bundle.js  2.96 MiB    main  [emitted]  main
Entrypoint main = bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {main}
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {main}
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {main}
[./node_modules/react-dom/cjs/react-dom.development.js] 709 KiB {main}
[./node_modules/react-dom/index.js] 1.32 KiB {main}
[./node_modules/react/cjs/react.development.js] 65.9 KiB {main}
[./node_modules/react/index.js] 189 bytes {main}
[./node_modules/scheduler/cjs/scheduler-tracing.development.js] 9.91 KiB {main}
[./node_modules/scheduler/cjs/scheduler.development.js] 26.5 KiB {main}
[./node_modules/scheduler/index.js] 197 bytes {main}
[./node_modules/scheduler/tracing.js] 213 bytes {main}
[./src/calc.js] 121 bytes {main} [built]
[./src/index.js] 208 bytes {main}
```

### Vendor bundles

```
$ node ./bundle-vendor.js
[BABEL] Note: The code generator has deoptimised the styling of /Users/gleb/git/webpack-bundle-experiment/node_modules/react-dom/cjs/react-dom.development.js as it exceeds the max of 500KB.
*******
2020-05-07T02:11:21.009Z
*******
Hash: 06e94ec4ab7eea301dba
Version: webpack 4.43.0
Time: 3529ms
Built at: 05/06/2020 10:11:21 PM
                 Asset      Size        Chunks             Chunk Names
        main.bundle.js  17.3 KiB          main  [emitted]  main
vendors~main.bundle.js  2.95 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.bundle.js main.bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {vendors~main} [built]
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {vendors~main} [built]
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {vendors~main} [built]
[./node_modules/react-dom/cjs/react-dom.development.js] 709 KiB {vendors~main} [built]
[./node_modules/react-dom/index.js] 1.32 KiB {vendors~main} [built]
[./node_modules/react/cjs/react.development.js] 65.9 KiB {vendors~main} [built]
[./node_modules/react/index.js] 189 bytes {vendors~main} [built]
[./node_modules/scheduler/cjs/scheduler-tracing.development.js] 9.91 KiB {vendors~main} [built]
[./node_modules/scheduler/cjs/scheduler.development.js] 26.5 KiB {vendors~main} [built]
[./node_modules/scheduler/index.js] 197 bytes {vendors~main} [built]
[./node_modules/scheduler/tracing.js] 213 bytes {vendors~main} [built]
[./src/calc.js] 121 bytes {main} [built]
[./src/index.js] 208 bytes {main} [built]
```

Watching using vendor bundles

```
First load
$ node ./watch-vendor.js
[BABEL] Note: The code generator has deoptimised the styling of /Users/gleb/git/webpack-bundle-experiment/node_modules/react-dom/cjs/react-dom.development.js as it exceeds the max of 500KB.
*******
2020-05-07T02:12:11.424Z
*******
Hash: 06e94ec4ab7eea301dba
Version: webpack 4.43.0
Time: 3745ms
Built at: 05/06/2020 10:12:11 PM
                 Asset      Size        Chunks             Chunk Names
        main.bundle.js  17.3 KiB          main  [emitted]  main
vendors~main.bundle.js  2.95 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.bundle.js main.bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {vendors~main} [built]
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {vendors~main} [built]
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {vendors~main} [built]
[./node_modules/react-dom/cjs/react-dom.development.js] 709 KiB {vendors~main} [built]
[./node_modules/react-dom/index.js] 1.32 KiB {vendors~main} [built]
[./node_modules/react/cjs/react.development.js] 65.9 KiB {vendors~main} [built]
[./node_modules/react/index.js] 189 bytes {vendors~main} [built]
[./node_modules/scheduler/cjs/scheduler-tracing.development.js] 9.91 KiB {vendors~main} [built]
[./node_modules/scheduler/cjs/scheduler.development.js] 26.5 KiB {vendors~main} [built]
[./node_modules/scheduler/index.js] 197 bytes {vendors~main} [built]
[./node_modules/scheduler/tracing.js] 213 bytes {vendors~main} [built]
[./src/calc.js] 121 bytes {main} [built]
[./src/index.js] 208 bytes {main} [built]

Edit file

Hash: 01b0e42de9077ef9c17c
Version: webpack 4.43.0
Time: 19ms
Built at: 05/06/2020 10:12:49 PM
                 Asset      Size        Chunks  Chunk Names
        main.bundle.js  17.3 KiB          main  main
vendors~main.bundle.js  2.95 MiB  vendors~main  vendors~main
Entrypoint main = vendors~main.bundle.js main.bundle.js
[./node_modules/object-assign/index.js] 2.17 KiB {vendors~main}
[./node_modules/prop-types/checkPropTypes.js] 3.95 KiB {vendors~main}
[./node_modules/prop-types/lib/ReactPropTypesSecret.js] 311 bytes {vendors~main}
[./node_modules/react-dom/cjs/react-dom.development.js] 709 KiB {vendors~main}
[./node_modules/react-dom/index.js] 1.32 KiB {vendors~main}
[./node_modules/react/cjs/react.development.js] 65.9 KiB {vendors~main}
[./node_modules/react/index.js] 189 bytes {vendors~main}
[./node_modules/scheduler/cjs/scheduler-tracing.development.js] 9.91 KiB {vendors~main}
[./node_modules/scheduler/cjs/scheduler.development.js] 26.5 KiB {vendors~main}
[./node_modules/scheduler/index.js] 197 bytes {vendors~main}
[./node_modules/scheduler/tracing.js] 213 bytes {vendors~main}
[./src/calc.js] 122 bytes {main} [built]
[./src/index.js] 208 bytes {main}
```

So - with inline source maps, splitting the chunks into main and vendor bundles makes _huuuuge_ difference.
