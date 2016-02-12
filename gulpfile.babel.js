import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import glob from 'glob';
import Mocha from 'mocha';
import eslint from 'eslint';
import ESDoc  from 'esdoc/out/src/ESDoc';
import ESDocPublisher from 'esdoc/out/src/Publisher/publish';

const Promise = global.Promise || require('es6-promise').Promise;

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
 * Clear module cache.
 */
function clearModuleCache(path) {
  delete require.cache[path];
}

/**
 * Run tests in the specified file pattern using Mocha
 */
function runTests(pattern, options) {
  const mocha = new Mocha(options);
  const files = glob.sync(pattern, { realpath: true });
  files.forEach(file => {
    clearModuleCache(file);  // For watching
    mocha.addFile(file);
  });
  return new Promise((resolve, reject) => {
    try {
      mocha.run(resolve);
    } catch(e) {
      reject(e);
    }
  });
}

/**
 * Run a given task. And re-run it whenever the specified files change.
 */
function runAndWatch(watchPattern, initialValue, task) {
  gulp.watch(watchPattern, event => {
    task(event.path, event);
  });
  return task(initialValue);
}

gulp.task('test:prepare', () => {
  require('babel-core/register');
});

gulp.task('test', ['test:prepare'], () => {
  return runTests(GLOB.spec)
    .then(exitCode => process.exit(exitCode))
    .catch(e => { throw e; });
});

gulp.task('test:watch', ['test:prepare'], () => {
  function test() {
    runTests(GLOB.spec, { reporter: 'dot' })
      .catch(e => console.log(e.stack));
  }
  const sourceFiles = glob.sync(GLOB.lib, { realpath: true });
  gulp.watch(GLOB.lib, () => {
    sourceFiles.forEach(f => clearModuleCache(f));
    test();
  });
  runAndWatch(GLOB.spec, null, () => test());
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
    rules: { 'no-console': 0 }
  });
});

gulp.task('lint:doc', () => {
  lintFiles('./README.md', true, {
    plugins: [ 'markdown' ],
    rules: { 'no-undef': 0 }
  })
});

gulp.task('lint:watch', () => {
  const linter = new eslint.CLIEngine();
  function lintAndReport(path) {
    const report = linter.executeOnFiles([path]);
    const formatter = linter.getFormatter();
    console.log(formatter(report.results));
  }
  runAndWatch(GLOB.lib, GLOB.lib, lintAndReport);
  runAndWatch(GLOB.spec, GLOB.spec, lintAndReport);
});

gulp.task('lint', [
  'lint:lib',
  'lint:test'
]);

gulp.task('lint:all', [
  'lint',
  'lint:gulp',
  'lint:doc'
]);

gulp.task('check', [
  'lint:all',
  'test'
]);

gulp.task('default', [
  'lint:watch',
  'test:watch'
]);

gulp.task('doc', () => {
  const config = require('./esdoc.json');
  ESDoc.generate(config, ESDocPublisher);
});
