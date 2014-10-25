var gulp = require('gulp');
var util = require('gulp-util');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');
var plumber = require('gulp-plumber');

var getAppJsSrc = require('./gulp/app-src-stream');

var browserSyncReload = false;
var minifyCode = false;

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: __dirname + '/public'
        }
    });
});

gulp.task('less', function () {
    return gulp.src('public/less/app.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
        .pipe(filter('**/*.css'))
        .pipe(gulpif(browserSyncReload, reload({stream:true})));
});

gulp.task('js', function () {
    parseArguments();

    return getAppJsSrc('public/app-src')
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(sourcemaps.init())
        .pipe(concat('angel-wallet.js'))
        .pipe(gulpif(minifyCode, uglify()))
        .pipe(sourcemaps.write())
        .pipe(plumber.stop())
        .pipe(gulp.dest('public/app'))
        .pipe(gulpif(browserSyncReload, reload({stream:true})));
});

gulp.task('dev', ['js', 'less', 'browser-sync'], function(){
    browserSyncReload = true;

    gulp.watch('public/app-src/**/*', ['js']);
    gulp.watch('public/less/**/*.{css,less}', ['less']);
});

function parseArguments(){
    if(util.env.production){
        minifyCode = true;
    }
}