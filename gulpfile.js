var gulp = require('gulp');
var pug = require('gulp-pug');
var postcss = require('gulp-postcss');
var atImport = require('postcss-import');
var cssnext = require("postcss-cssnext");
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var rename = require("gulp-rename");
var connect = require('gulp-connect');

gulp.task('connect', function () {
  connect.server({
    root: '.',
    livereload: true
  });
});

gulp.task('css:process', function () {
  var plugins = [
    atImport(),
    cssnext({
      features: {
        rem: {
          html: false
        }
      }
    })
  ];
  return gulp.src('./css/imports.css')
    .pipe(postcss(plugins))
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.', {
      addComment: false
    }))
    .pipe(connect.reload())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./dest'))
});

gulp.task('css:clean', function (done) {
  return del(['./dest/style.css'], done);
});

gulp.task('css', gulp.series('css:clean', 'css:process'));

gulp.task('css:watch', function () {
  gulp.watch([
    './css/*.css'
  ], gulp.series(
    'css'
  ));
});

gulp.task('js:process', function () {
  return gulp.src(['./js/script.js'])
    .pipe(concat('script.js'))
    .pipe(uglify({
      compress: true
    }))
    .pipe(connect.reload())
    .pipe(gulp.dest('./dest'))
});

gulp.task('js:clean', function (done) {
  return del(['./dest/script.js'], done);
});

gulp.task('js', gulp.series('js:clean', 'js:process'));

gulp.task('js:watch', function () {
  gulp.watch([
    './js/*.js'
  ], gulp.series(
    'js'
  ));
});

gulp.task('views:process', function buildHTML() {
  return gulp.src('./views/*.pug')
    .pipe(pug())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(connect.reload())
    .pipe(gulp.dest('.'))
});

gulp.task('views:clean', function (done) {
  return del(['.*.html'], done);
});

gulp.task('views', gulp.series('views:clean', 'views:process'));

gulp.task('views:watch', function () {
  gulp.watch([
    './views/*.pug'
  ], gulp.series(
    'views'
  ));
});

gulp.task('default', gulp.series('css', 'js', 'views'));
gulp.task('watch', gulp.parallel('css:watch', 'js:watch', 'views:watch'));
gulp.task('dev', gulp.parallel('default', 'connect', 'watch'));