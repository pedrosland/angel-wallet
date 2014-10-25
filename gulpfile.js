var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var filter = require('gulp-filter');

var getAppJsSrc = require('./gulp/app-src-stream');

var browserSyncReload = false;

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
    return getAppJsSrc('public/app-src')
        .pipe(jshint())
        .pipe(sourcemaps.init())
        .pipe(concat('angel-wallet.js'))
//        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/app'))
//        .pipe(filter('**/*.js'))
        .pipe(gulpif(browserSyncReload, reload({stream:true})));
});

gulp.task('dev', ['js', 'less', 'browser-sync'], function(){
    browserSyncReload = true;

    gulp.watch('public/app-src/**/*', ['js']);
    gulp.watch('public/less/**/*.{css,less}', ['less']);
});