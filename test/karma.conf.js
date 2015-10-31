const Promise = require('bluebird');

Promise.prototype.cancellable = function() {
  return this;
};

const babelLoader  = 'babel-loader?presets[]=nktpro&plugins[]=transform-regenerator';

module.exports = function(config) {
  config.set({
    browsers       : ['PhantomJS'],
    autoWatch: true,
    // singleRun      : true,
    frameworks     : ['jasmine'],
    files          : [
      'test/bundle.js'
    ],
    preprocessors  : {
      'test/bundle.js': ['webpack', 'sourcemap']
    },
    reporters      : ['dots'],
    webpack        : {
      devtool: 'inline-source-map',
      resolve: {
        extensions: ['', '.js', '.ts', '.tsx']
      },
      module : {
        loaders: [
          {
            test   : /\.js(x?)$/,
            loader : babelLoader,
            exclude: /node_modules\//
          },
          {
            test   : /\.ts(x?)$/,
            loaders: [babelLoader, 'ts-loader']
          }
        ]
      },
      output : {
        devtoolModuleFilenameTemplate        : "[absolute-resource-path]",
        devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
      }
    },
    webpackServer  : {
      //noInfo: true //please don't spam the console when running in karma!
    }
  });
};
