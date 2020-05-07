function printWebpackStates(err, stats) {
  console.log('*******')
  console.log(new Date())
  console.log('*******')
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
}

module.exports = {printWebpackStates}
