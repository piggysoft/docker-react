module.exports = {
  js: {
    test   : /\.js(x?)$/,
    loader : 'babel-loader',
    exclude: /node_modules\//
  },
  ts: {
    test   : /\.ts(x?)$/,
    loaders: [
      'ts-awaiter-loader',
      'chaining-ts-loader?instance=es5&transpileOnly=true&configFileName=tsconfig.es5.json',
      'babel-loader?plugins[]=transform-regenerator',
      'ts-loader?instance=es6']
  }
}
