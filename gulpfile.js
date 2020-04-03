// LICENSE.md

const path = require('path');
const browserSync = require('browser-sync');
const cssnano = require('cssnano');
const del = require('del');
const postcssPresetEnv = require('postcss-preset-env');
const postcssReporter = require('postcss-reporter');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const { dest, parallel, series, src, watch } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const gulpStylelint = require('gulp-stylelint');

const production = process.env.NODE_ENV === 'production';
const $ = gulpLoadPlugins();
const server = browserSync.create();

process.traceDeprecation = production === false;

console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`); // eslint-disable-line

const clean = () => del(['dist'], { dot: true });

const lintScripts = () =>
  src([
    './scripts/**/*.js',
    'gulpfile.js',
    '!./scripts/**/*.min.js*',
    '!node_modules/**'
  ])
    .pipe($.eslint())
    .pipe($.eslint.format());

const lintStyles = () =>
  src(['./styles/**/*.css', '!./styles/**/*.min.css']).pipe(
    gulpStylelint({
      failAfterError: false,
      reporters: [
        {
          formatter: 'verbose',
          console: true
        }
      ],
      debug: true
    })
  );

const scripts = done => {
  webpack(
    {
      entry: './scripts/main.js',
      target: 'web',
      performance: {
        hints: 'warning' // false, 'error'
      },
      mode: production === true ? 'production' : 'development',
      devtool: 'source-map',
      watch: false,
      output: {
        path: path.resolve(__dirname, './scripts'),
        filename: '[name].min.js'
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true
              }
            }
          }
        ]
      },
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            sourceMap: production === false,
            terserOptions: {
              output: { comments: false }
            },
            extractComments: false
          })
        ]
      }
    },
    (error, stats) => {
      if (error) {
        throw new Error(error);
      }
      console.log('[webpack]', stats.toString({ chunks: false, colors: true }));

      done();
    }
  );
};

const styles = () =>
  src('./styles/main.css')
    .pipe($.if(production === false, $.sourcemaps.init()))
    .pipe(
      $.postcss([
        postcssPresetEnv({
          stage: 0 // default is 3
        }),
        cssnano({
          safe: true
        }),
        postcssReporter()
      ])
    )
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.if(production === false, $.sourcemaps.write('./')))
    .pipe(dest('./styles/'))
    .pipe($.size({ title: 'styles' }));

const images = () =>
  src('./images/**/*')
    .pipe(
      $.imagemin({
        progressive: true,
        interlaced: true
      })
    )
    .pipe(dest('./images/'))
    .pipe($.size({ title: 'images' }));

const html = () =>
  src('./index-src.html')
    .pipe(
      $.htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe($.minifyInline())
    .pipe($.rename({ basename: 'index' }))
    .pipe(dest('./'))
    .pipe($.size({ title: 'html' }));

const reload = done => server.reload()(done);

const listen = () => {
  browserSync({
    notify: false,
    server: './',
    files: [
      './**/*.html',
      './images/**/*',
      './styles/main.css',
      './scripts/main.js'
    ],
    port: 8080
  });

  watch(['./index-src.html'], series(html, reload));
  watch(['./styles/main.css'], series(lintStyles, styles, reload));
  watch(['./scripts/main.js'], series(lintScripts, scripts, reload));
};

const serve = () =>
  series(
    clean,
    parallel(
      series(lintScripts, scripts),
      series(lintStyles, styles),
      images,
      html
    ),
    listen
  )();

const build = done =>
  series(
    clean,
    parallel(
      series(lintScripts, scripts),
      series(lintStyles, styles),
      images,
      html
    )
  )(done);

Object.assign(exports, {
  build,
  clean,
  default: build,
  images,
  lintScripts,
  lintStyles,
  scripts,
  serve
});
