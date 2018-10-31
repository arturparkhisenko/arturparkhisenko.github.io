// LICENSE.md

const path = require('path');
const gulp = require('gulp');
const webpack = require('webpack');
const del = require('del');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const gulpStylelint = require('gulp-stylelint');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');
const postcssCssnext = require('postcss-cssnext');
const postcssReporter = require('postcss-reporter');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const $ = gulpLoadPlugins();
const production = process.env.NODE_ENV === 'production';

console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`); // eslint-disable-line

gulp.task('clean', () =>
  del(['dist'], {
    dot: true
  })
);

gulp.task('lintScripts', () =>
  gulp
    .src([
      './scripts/**/*.js',
      'gulpfile.js',
      '!./scripts/**/*.min.js*',
      '!node_modules/**'
    ])
    .pipe($.eslint())
    .pipe($.eslint.format())
);

gulp.task('lintStyles', () =>
  gulp.src(['./styles/**/*.css', '!./styles/**/*.min.css']).pipe(
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
  )
);

gulp.task('scripts', (cb) => {
  webpack(
    {
      entry: './scripts/main.js',
      target: 'web',
      performance: {
        hints: 'warning' // false, 'error'
      },
      mode: production ? 'production' : 'development',
      devtool: 'source-map', // cheap-module-source-map
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
              loader: 'babel-loader?cacheDirectory=true'
            }
          }
        ]
      },
      optimization: {
        minimize: true,
        minimizer: [
          new UglifyJsPlugin({
            uglifyOptions: {
              output: {
                comments: false
              }
            }
          })
        ]
      }
    },
    (err, stats) => {
      if (err) {
        throw new $.util.PluginError('webpack', err);
      }
      $.util.log(
        '[webpack]',
        stats.toString({
          chunks: false,
          colors: true
        })
      );
      $.util.log('[webpack]', 'Packed successfully!');
    }
  );

  cb();
});

gulp.task('styles', () =>
  gulp
    .src(['./styles/main.css'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.postcss([
        postcssPresetEnv({
          stage: 0 // default is 3
        }),
        postcssCssnext({
          warnForDuplicates: false
        }),
        cssnano({
          safe: true
        }),
        postcssReporter()
      ])
    )
    .pipe(
      $.rename({
        suffix: '.min'
      })
    )
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./styles/'))
    .pipe(
      $.size({
        title: 'styles'
      })
    )
);

gulp.task('images', () =>
  gulp
    .src(['./images/**/*'], {
      since: gulp.lastRun('images')
    })
    .pipe(
      $.imagemin({
        progressive: true,
        interlaced: true
      })
    )
    .pipe(gulp.dest('./images/'))
    .pipe(
      $.size({
        title: 'images'
      })
    )
);

gulp.task('html', () =>
  gulp
    .src(['./index-src.html'], {
      since: gulp.lastRun('html')
    })
    .pipe(
      $.htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe($.minifyInline())
    .pipe(
      $.rename({
        basename: 'index'
      })
    )
    .pipe(gulp.dest('./'))
    .pipe(
      $.size({
        title: 'html'
      })
    )
);

const watch = () => {
  browserSync({
    notify: false,
    logPrefix: 'watch',
    // https: true,
    server: './',
    files: [
      './**/*.html',
      './images/**/*',
      './styles/main.css',
      './scripts/main.js'
    ],
    port: 8080,
    browser: 'google chrome'
  });

  gulp.watch(['./**/*.html'], gulp.series('html'));
  gulp.watch(['./styles/main.css'], gulp.series('lintStyles', 'styles'));
  gulp.watch(['./scripts/main.js'], gulp.series('lintScripts', 'scripts'));
};

gulp.task(
  'serve',
  gulp.series(
    'clean',
    gulp.parallel(
      gulp.series('lintScripts', 'scripts'),
      gulp.series('lintStyles', 'styles'),
      // 'images',
      'html'
    ),
    watch
  )
);

// Build production files, the default task
gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel(
      gulp.series('lintScripts', 'scripts'),
      gulp.series('lintStyles', 'styles'),
      'images',
      'html'
    )
  )
);
