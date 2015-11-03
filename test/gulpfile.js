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

const cli          = minimist(process.argv.slice(2), cliOptions);
const distPath     = cli.path;
const polyfillPath = '../polyfill.js';
const babelLoader  = 'babel-loader?presets[]=nktpro&plugins[]=transform-regenerator';

const webpackConfig = {
  output: {
    filename: '[name].js'
  },

  resolve: {
    // Simply means that when it tries to resolve "foo/bar/baz",
    // it will try "foo/bar/baz.js" and "foo/bar/baz.jsx" too
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  },

  module: {
    loaders: [
      // Transpile all .jsx files with babel
      {
        test   : /\.js(x?)$/,
        loader : babelLoader,
        exclude: /node_modules\//
      },
      // TypeScript
      {
        test   : /\.ts(x?)$/,
        loaders: [babelLoader, 'ts-loader']
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
      '__BUILD__'  : '1',
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
  const config = _merge(webpackConfig, {
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

  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  new WebpackDevServer(webpack(config), {
    contentBase : './public',
    publicPath  : '/',
    hot         : true,
    stats       : {cached: false, cachedAssets: false}
  }).listen(11111, null, function(err) {
    if (err) {
      throw new err;
    }
    console.log('Dev server is up at http://localhost:11111/');
  });
});

const tslint = require('gulp-tslint');
gulp.task('tslint', function() {
  return gulp.src(['src/**/*.ts', 'src/**/*.tsx', '!src/typings/**/*'])
             .pipe(tslint())
             .pipe(tslint.report('prose', {
               summarizeFailureOutput: true
             }));
});

const eslint = require('gulp-eslint');
gulp.task('eslint', function() {
  return gulp.src(['src/**/*.js', 'src/**/*.jsx'])
             // eslint() attaches the lint output to the eslint property
             // of the file object so it can be used by other modules.
             .pipe(eslint())
             // eslint.format() outputs the lint results to the console.
             // Alternatively use eslint.formatEach() (see Docs).
             .pipe(eslint.format())
             // To have the process exit with an error code (1) on
             // lint error, return the stream and pipe to failAfterError last.
             .pipe(eslint.failAfterError());
});

const KarmaServer = require('karma').Server;
gulp.task('test', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
