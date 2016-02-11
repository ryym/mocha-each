const gulp   = require('gulp');
const babel  = require('gulp-babel');
const del    = require('del');
const glob   = require('glob');
const Mocha  = require('mocha');

const GLOB = {
  lib: './lib/**/*.js',
  build: './build/**/*.js',
  spec: './test/**/*.spec.js'
};

gulp.task('clean', () => {
  return del([GLOB.build]);
});

gulp.task('build', ['clean'], () => {
  return gulp.src(GLOB.lib)
    .pipe(babel())
    .pipe(gulp.dest('build/'));
});

/**
 * Run tests in the specified file pattern using Mocha
 */
function runTests(pattern, options) {
  const mocha = new Mocha(options);
  const files = glob.sync(pattern, { realpath: true });
  files.forEach(file => mocha.addFile(file));
  return new Promise((resolve, reject) => {
    try {
      mocha.run(resolve);
    } catch(e) {
      reject(e);
    }
  });
}

gulp.task('test:prepare', () => {
  require('babel-core/register');
});

gulp.task('test', ['test:prepare'], () => {
  return runTests(GLOB.spec)
    .then(exitCode => process.exit(exitCode))
    .catch(e => { throw e; });
});
