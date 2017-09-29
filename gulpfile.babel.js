import gulp from 'gulp';
import eslint from 'gulp-eslint';
import { spawn } from 'child_process';

/**
 * Task for linting .js files.
 * @example
 * gulp lint
 * // lints all .js files including this (gulpfile.babel.js) file itself
 * @example
 * gulp lint -p app/main.js
 * gulp lint --path app/main.js
 * // lints 'main.js' file in 'app' folder
 */
gulp.task('lint', () => {
  const path = ['*.babel.js', 'src/**/*.js', 'test/**/*.js'];
  return gulp.src(path)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('run', cb =>
  spawn('node_modules/.bin/node-dev', ['server'], { stdio: 'inherit' })
    .on('close', () => cb()));
