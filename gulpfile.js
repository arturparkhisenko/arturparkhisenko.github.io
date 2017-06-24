// LICENSE.md
const path = require('path');
const gulp = require('gulp');
const webpack = require('webpack');
const del = require('del');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const gulpStylelint = require('gulp-stylelint');
const cssnano = require('cssnano');
const postcssImport = require('postcss-import');
// const postcssUrl = require('postcss-url');
const postcssCssnext = require('postcss-cssnext');
// const postcssBrowserReporter = require('postcss-browser-reporter');
const postcssReporter = require('postcss-reporter');

const $ = gulpLoadPlugins();
// const reload = browserSync.reload;

gulp.task('clean', () => del(['.tmp', 'dist'], {
  dot: true
}));

gulp.task('lint:scripts', () =>
  gulp.src([
    './scripts/**/*.js',
    // './**/*.html',
    'gulpfile.js',
    '!./scripts/**/*.min.js*',
    '!node_modules/**'
  ])
  .pipe($.eslint())
  .pipe($.eslint.format())
  // .pipe($.eslint.failAfterError())
  // .pipe($.if(!browserSync.active, $.eslint.failOnError()));
);

// consoleReporter(),
gulp.task('lint:styles', () =>
  gulp.src([
    './styles/**/*.css',
    '!./styles/**/*.min.css'
  ])
  // .pipe($.stylelint({
  .pipe(gulpStylelint({
    failAfterError: false,
    reporters: [{
      formatter: 'verbose',
      console: true
    }],
    debug: true
  }))
);

gulp.task('scripts', (cb) => {
  webpack({
      entry: {
        main: [
          './scripts/main.js'
        ]
      },
      devtool: 'source-map', // cheap-module-source-map
      watch: false,
      output: {
        path: path.resolve(__dirname, './scripts'),
        filename: '[name].min.js'
      },
      module: {
        rules: [{
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', {
                  'targets': {
                    'browsers': [
                      '> 1%',
                      'last 2 versions',
                      'safari >= 7',
                      'Firefox ESR'
                    ]
                  },
                  'modules': false,
                  'loose': true
                }]
              ]
            }
          }
        }]
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          output: {
            comments: false
          }
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
      ]
    },
    (err, stats) => {
      if (err) {
        throw new $.util.PluginError('webpack', err);
      }
      $.util.log('[webpack]', stats.toString({
        // output options
        // https://github.com/webpack/docs/wiki/node.js-api
        chunks: false,
        colors: true
      }));
      $.util.log('[webpack]', 'Packed successfully!');
    });

  cb();
});

gulp.task('styles', () =>
  gulp.src([
    './styles/main.css'
    // ], { read: false }
  ])
  // ], {
  //   since: gulp.lastRun('styles'),
  // })
  .pipe($.plumber())
  // .pipe($.newer('./styles'))
  .pipe($.sourcemaps.init())
  .pipe($.postcss([
    postcssImport({
      // path: ['./styles/**/*'],
      // from: './styles/main.css',
    }),
    // postcssUrl({
    //   url: 'inline',
    // }),
    postcssCssnext({
      browsers: '> 1%, last 2 versions, safari >= 7, Firefox ESR',
      warnForDuplicates: false
    }),
    cssnano({
      safe: true
    }),
    // postcssBrowserReporter(),
    postcssReporter()
  ]))
  .pipe($.rename({
    suffix: '.min'
  }))
  .pipe($.sourcemaps.write('./'))
  .pipe(gulp.dest('./styles/'))
  .pipe($.size({
    title: 'styles'
  }))
);

gulp.task('images', () =>
  gulp.src([
    './images/**/*'
  ], {
    since: gulp.lastRun('images')
  })
  .pipe($.imagemin({
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest('./images/'))
  .pipe($.size({
    title: 'images'
  }))
);

gulp.task('html', () =>
  gulp.src([
    './index-src.html'
  ], {
    since: gulp.lastRun('html')
  })
  // .pipe($.newer('dist/'))
  .pipe($.htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe($.minifyInline())
  .pipe($.rename({
    // suffix: '.min',
    basename: 'index'
  }))
  .pipe(gulp.dest('./'))
  .pipe($.size({
    title: 'html'
  }))
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
      './styles/module-variables.css',
      './scripts/main.js',
      './scripts/module-bg.js',
      './scripts/module-effects.js'
    ],
    port: 8080,
    browser: 'google chrome'
  });

  gulp.watch(['./**/*.html'], gulp.series('html'));
  // gulp.watch(['./images/**/*'], gulp.series('images'));
  gulp.watch([
    './styles/main.css',
    './styles/module-variables.css'
  ], gulp.series('lint:styles', 'styles'));
  gulp.watch([
    './scripts/main.js',
    './scripts/module-bg.js',
    './scripts/module-effects.js'
  ], gulp.series('lint:scripts', 'scripts'));
};

gulp.task('serve',
  gulp.series('clean',
    gulp.parallel(
      gulp.series('lint:scripts', 'scripts'),
      gulp.series('lint:styles', 'styles'),
      // 'images',
      'html'
    ),
    watch
  )
);

// Build production files, the default task
gulp.task('default', gulp.series('clean',
  gulp.parallel(
    gulp.series('lint:scripts', 'scripts'),
    gulp.series('lint:styles', 'styles'),
    'images',
    'html'
  )
));
