var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnano = require('gulp-cssnano'),
    nunjucksRender = require('gulp-nunjucks-render'),
    concat = require('gulp-concat'),
    package = require('./package.json');


var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');

function swallowError (error) {

    //If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}

gulp.task('css', function () {
    return gulp.src('assets/scss/app.scss')
    //.pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    //.pipe(sourcemaps.write())
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('assets/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  return gulp.src(['assets/js/vendor/jquery.js',
    'assets/js/vendor/**/!(jquery)*.js',
    'assets/js/vendor/bootstrap.js',
    'assets/js/vendor/**/!(bootstrap)*.js',
    'assets/js/app.js'])
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('app.min.js'))
    //.pipe(gulp.dest('assets/js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('nunjucks', function() {
  nunjucksRender.nunjucks.configure(['assets/html/templates']);
  return gulp.src('assets/html/pages/**/*.+(html|nunjucks)')
  .pipe(nunjucksRender())
  .on('error', swallowError)
  .pipe(gulp.dest('./'))
  .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "./"
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css', 'js', 'browser-sync'], function () {
    gulp.watch("assets/scss/*/*.scss", ['css']);
    gulp.watch(["assets/js/*.js", "!assets/js/app.min.js"], ['js']);
    //gulp.watch("assets/*.html", ['bs-reload']);
    gulp.watch('assets/html/**/*+(html|nunjucks)', ['nunjucks']);
});
