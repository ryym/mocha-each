const gulp   = require('gulp');
const babel  = require('gulp-babel');
const del    = require('del');
const glob   = require('glob');
const Mocha  = require('mocha');
const eslint = require('eslint');

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

/**
 * Lint the specified files using eslint.
 */
function lintFiles(pattern, strict, configs) {
  const linter = new eslint.CLIEngine(configs);
  const report = linter.executeOnFiles([pattern]);
  const formatter = linter.getFormatter();
  console.log(formatter(report.results));
  if (0 < report.errorCount || (strict && 0 < report.warningCount)) {
    throw new Error('eslint reports some problems.');
  }
}

gulp.task('lint:lib', () => {
  lintFiles(GLOB.lib, true);
});

gulp.task('lint:test', () => {
  lintFiles(GLOB.spec, true);
});

gulp.task('lint:gulp', () => {
  lintFiles('./gulpfile.js', true, {
    rules: {
      'no-multi-spaces': 0,
      'no-console': 0
    }
  });
});

gulp.task('lint', [
  'lint:lib',
  'lint:test'
]);

gulp.task('lint:all', [
  'lint',
  'lint:gulp'
]);

