// LICENSE.md
import gulp from 'gulp';
import { rollup } from 'rollup';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import del from 'del';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import gulpStylelint from 'gulp-stylelint';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import postcssCssnext from 'postcss-cssnext';
import postcssBrowserReporter from 'postcss-browser-reporter';
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

gulp.task('scripts', () =>
  rollup({
    entry: './scripts/main.js',
    plugins: [
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: 'es2015-rollup',
      }),
      uglify(),
    ],
  })
  .then(bundle => bundle.write({
    // output format - 'amd', 'cjs', 'es6', 'iife', 'umd'
    format: 'iife',
    dest: './scripts/main.min.js',
    sourceMap: true,
  }))
  .then(() => {
    // console.log('JS bundle created');
  })
);

gulp.task('styles', () =>
  gulp.src([
    './styles/main.css',
    // ], { read: false }
  ], {
    since: gulp.lastRun('styles'),
  })
  .pipe($.plumber())
  // .pipe($.newer('./styles'))
  .pipe($.sourcemaps.init())
  .pipe($.postcss([
    postcssImport({
      // path: ['./styles/**/*'],
      // from: './styles/main.css',
    }),
    postcssUrl({
      url: 'inline',
    }),
    postcssCssnext({
      browsers: '> 5%',
    }),
    cssnano({
      safe: true,
    }),
    postcssBrowserReporter(),
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

// gulp.task('copy', () =>
//   gulp.src([
//     './**/*.{html,ico}',
//     './**/*.{txt,ico}',
//     '!./test',
//     '!./precache.json',
//   ], {
//     dot: true,
//     since: gulp.lastRun('copy'),
//   }).pipe(gulp.dest('./'))
//   .pipe($.size({
//     title: 'copy',
//   }))
// );

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
    logPrefix: '👀',
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
      // 'images', 'copy'
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
    // 'images', 'copy', 'html'
    // 'images',
    'html'
  )
));
