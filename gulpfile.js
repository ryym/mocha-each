const gulp   = require('gulp');
const babel  = require('gulp-babel');
const del    = require('del');

const GLOB = {
  lib: './lib/**/*.js',
  build: './build/**/*.js'
};

gulp.task('clean', () => {
  return del([GLOB.build]);
});

gulp.task('build', ['clean'], () => {
  return gulp.src(GLOB.lib)
    .pipe(babel())
    .pipe(gulp.dest('build/'));
});
