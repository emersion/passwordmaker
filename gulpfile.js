var gulp = require('gulp');
var zip = require('gulp-zip');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');

var files = ['manifest.json', 'popup.html', 'css/**', 'font/**', 'img/**', 'js/**'];
var xpiName = 'passwordmaker.xpi';

gulp.task('browserify', function () {
	var b = browserify();
	return b.require('passwordmaker')
		.require('url')
		.bundle()
		.pipe(source('passwordmaker.js'))
		.pipe(buffer())
		.pipe(gulp.dest('js'));
});

gulp.task('xpi', function () {
	gulp.src(files)
		.pipe(zip(xpiName))
		.pipe(gulp.dest('.'));
});
