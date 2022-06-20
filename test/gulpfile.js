const _merge            = require('lodash.merge');
const gulp              = require('gulp');
const webpack           = require('webpack');
const gulpWebpack       = require('webpack-stream');
const path              = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackDevServer  = require('webpack-dev-server');
const minimist          = require('minimist');
const cliOptions        = {
  string : 'path',
  default: {path: 'build'}
};

const cli      = minimist(process.argv.slice(2), cliOptions);
const distPath = cli.path;
const polyfillPath = '../polyfill.js';

const webpackConfig = {
  output: {
    filename: '[name].js'
  },

  resolve: {
    // Simply means that when it tries to resolve "foo/bar/baz",
    // it will try "foo/bar/baz.js" and "foo/bar/baz.jsx" too
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      // Transpile all .jsx files with babel
      {
        test  : /\.jsx$/,
        loader: 'babel',
        query : {
          presets: ["nktpro"],
          plugins: ["transform-regenerator"]
        }
      },
      // Bundle all .css files with auto-prefixing
      {
        test  : /\.css/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader?browsers=last 2 version')
      },
      // Compile and bundle all .less files with auto-prefixing
      {
        test  : /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader?browsers=last 2 version!less-loader')
      },
      // Automatically inline static assets inside CSS, size limit is 4096
      // (specified below, change it if you want)
      {
        test  : /\.(png|jpg|svg|eot|ttf|woff|raw)$/,
        loader: 'url-loader?limit=4096'
      },
      // Allow require('path/to/foo.json'), it's awesome
      {
        test  : /\.json$/,
        loader: 'json-loader'
      }
    ]
  },

  plugins: [
    // Bundle all CSS output to a single file
    new ExtractTextPlugin('index.css')
  ]
};

// Default is building for production
gulp.task('default', function() {
  webpackConfig.plugins.push(
    // This basically prepend process.env.NODE_ENV = "production"
    // at the beginning of the output JS bundle. UglifyJS will then perform deadcode elimination on
    // all "if" block where process.env.NOVE_ENV !== "production". In other words it strips all development code
    new webpack.DefinePlugin({
      '__BUILD__': '1',
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),
    // new webpack.optimize.DedupePlugin(),
    // UglifyJS to compress the heck out of it, including stripping out all console.*() calls
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
        booleans    : false,
        pure_getters: true
      }
    })
  );

  webpackConfig.output.filename = 'index.js';

  // Main.jsx is our entry point for index.js
  gulp.src([polyfillPath, './src/Main.jsx'])
      .pipe(gulpWebpack(webpackConfig)) // Run it through Webpack
      .pipe(gulp.dest(distPath)); // Then copy it to distPath

  gulp.src('./public/index.html')
      .pipe(gulp.dest(distPath)); // Simply copying ./public/index.html over to distPath
});

// Development task, basically start up a dev server that constantly watching for changes and update the output bundle
// All you need to do then is to make changes, and reload the browser
gulp.task('dev', function() {
  webpackConfig = _merge(webpackConfig, {
    cache      : true,
    debug      : true,
    // Make sure "Enable JavaScript source maps" is checked in Dev Tools settings and you're good to go
    devtool    : 'inline-source-map',
    stats      : {colors: true, reasons: true},
    contentBase: path.join(__dirname, 'public'),
    output     : {
      path: path.join(__dirname, 'public')
    },
    entry      : {
      index: ['webpack/hot/dev-server', polyfillPath, './src/Main.jsx']
    }
  });

  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  new WebpackDevServer(webpack(webpackConfig), {
    contentBase: './public',
    publicPath : '/',
    hot        : true,
    stats      : {cached: false, cachedAssets: false},
    watchOptions: {
      aggregateTimeout: 300,
      poll: 500
    },
  }).listen(11111, null, function(err) {
    if (err) {
      throw new err;
    }
    console.log('Dev server is up at http://localhost:11111/');
  });
});
