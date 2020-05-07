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
