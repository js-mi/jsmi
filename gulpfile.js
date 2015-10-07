// 引入 gulp
var gulp = require('gulp');

// 引入组件

var sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('gulp-browserify'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    port = process.env.port || 8080;

// live reload
gulp.task('connect',function(){
    connect.server({
        // root:'./',
        port: port,
        livereload: true,
    })
})

//scripts
gulp.task('scripts', function() {
     gulp.src('./src/js/*.js')
        .pipe(concat('Jsmi.js'))
        .pipe(gulp.dest('build/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe( connect.reload() )
        .pipe(notify({ message: 'Scripts common task complete' }));

});

gulp.task('html', function() {
     gulp.src('./**.html')
        .pipe( connect.reload() )
        .pipe(notify({ message: 'html common task complete' }));

});

//编译Sass，Autoprefix及缩小化
gulp.task('style', function() {
    return gulp.src('./src/scss/main.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('./build/js/tpl'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./build/js/tpl'))
        .pipe( connect.reload() )
        .pipe(notify({ message: 'Styles Common task complete' }));

});

/* 监听 */

gulp.task('watch', function() {
    // 看守所有 scss
    gulp.watch('src/scss/*.scss', ['scss']);
    // 看守所有.js档
    gulp.watch('src/js/*.js', ['scripts']);
    // 看守所有.html
    gulp.watch('./**.html',['html']);

});

gulp.task('serve',['connect','watch']);
