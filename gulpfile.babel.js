// LICENSE.md
import gulp from 'gulp';
import webpack from 'webpack';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import gulpStylelint from 'gulp-stylelint';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
// import postcssUrl from 'postcss-url';
import postcssCssnext from 'postcss-cssnext';
// import postcssBrowserReporter from 'postcss-browser-reporter';
import postcssReporter from 'postcss-reporter';

const $ = gulpLoadPlugins();
// const reload = browserSync.reload;

gulp.task('clean', () => del(['.tmp', 'dist'], {
  dot: true,
}));

gulp.task('lint:scripts', () =>
  gulp.src([
    './scripts/**/*.js',
    // './**/*.html',
    'gulpfile.babel.js',
    '!./scripts/**/*.min.js',
    '!node_modules/**',
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
    '!./styles/**/*.min.css',
  ])
  // .pipe($.stylelint({
  .pipe(gulpStylelint({
    // failAfterError: true,
    reporters: [{
      formatter: 'verbose',
      console: true,
    }],
    debug: true,
  }))
);

gulp.task('scripts', (cb) => {
  webpack({
    entry: {
      main: [
        './scripts/main.js',
      ],
    },
    devtool: 'source-map', // cheap-module-source-map
    watch: false,
    output: {
      path: './scripts',
      filename: '[name].min.js',
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'uglify!babel?presets[]=es2015',
      }],
    },
    'uglify-loader': {
      mangle: false,
    },
    plugins: [
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        // warnings: false,
        compress: { // or compressor
          warnings: false,
          // pure_getters: true,
          // unsafe: true,
          // unsafe_comps: true, // not documented
          // screw_ie8: true // not documented
        },
        output: {
          comments: false,
          // semicolons: true
        },
      }),
    ],
  },
  (err, stats) => {
    if (err) {
      throw new $.util.PluginError('webpack', err);
    }
    $.util.log('[webpack]', stats.toString({
      // output options
      // https://github.com/webpack/docs/wiki/node.js-api
      chunks: false,
      colors: true,
    }));
    $.util.log('[webpack]', 'Packed successfully!');
  });

  cb();
});

gulp.task('styles', () =>
  gulp.src([
    './styles/main.css',
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
      browsers: '> 1%, last 2 versions, Firefox ESR',
      warnForDuplicates: false,
    }),
    cssnano({
      safe: true,
    }),
    // postcssBrowserReporter(),
    postcssReporter(),
  ]))
  .pipe($.rename({
    suffix: '.min',
  }))
  .pipe($.sourcemaps.write('./'))
  .pipe(gulp.dest('./styles/'))
  .pipe($.size({
    title: 'styles',
  }))
);

gulp.task('images', () =>
  gulp.src([
    './images/**/*',
  ], {
    since: gulp.lastRun('images'),
  })
  .pipe($.imagemin({
    progressive: true,
    interlaced: true,
  }))
  .pipe(gulp.dest('./images/'))
  .pipe($.size({
    title: 'images',
  }))
);

gulp.task('html', () =>
  gulp.src([
    './index-src.html',
  ], {
    since: gulp.lastRun('html'),
  })
  // .pipe($.newer('dist/'))
  .pipe($.htmlmin({
    collapseWhitespace: true,
    removeComments: true,
  }))
  .pipe($.minifyInline())
  .pipe($.rename({
    // suffix: '.min',
    basename: 'index',
  }))
  .pipe(gulp.dest('./'))
  .pipe($.size({
    title: 'html',
  }))
);

const watch = () => {
  browserSync({
    notify: false,
    logPrefix: 'watch',
    https: true,
    server: './',
    files: [
      './**/*.html',
      './styles/**/*.css',
      '!./styles/**/*.{min.css,map}',
      './scripts/main.js',
      './scripts/module-bg.js',
      './scripts/module-effects.js',
    ],
    // scrollElementMapping: ['main', '.mdl-layout'],
    // port: 3000,
    // browser: 'chrome',
  });

  gulp.watch(['./**/*.html'], gulp.series('html'));
  // gulp.watch(['./images/**/*'], gulp.series('images'));
  gulp.watch([
    './styles/**/*.css', '!./styles/**/*.{min.css,map}',
  ], gulp.series('lint:styles', 'styles'));
  gulp.watch([
    // './scripts/**/*.js', '!./scripts/**/*.{min.js,map}',
    './scripts/main.js', './scripts/module-bg.js', './scripts/module-effects.js',
  ], gulp.series('lint:scripts', 'scripts'));

  // gulp.watch(['./**/*.html'], gulp.series('html', reload));
  // // gulp.watch(['./images/**/*'], gulp.series('images', reload));
  // gulp.watch([
  //   './styles/**/*.css', '!./styles/**/*.{min.css,map}',
  // ], gulp.series('lint:styles', 'styles', reload));
  // gulp.watch([
  //   // './scripts/**/*.js', '!./scripts/**/*.{min.js,map}',
  //   './scripts/main.js', './scripts/module-bg.js', './scripts/module-effects.js',
  // ], gulp.series('lint:scripts', 'scripts', reload));
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
