var gulp = require('gulp');
var zip = require('gulp-zip');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');

var dependencies = ['passwordmaker', 'url', 'debounce'];
var files = ['manifest.json', '*.html', 'css/**', 'font/**', 'img/**', 'js/**'];

gulp.task('browserify', function () {
	var b = browserify();

	dependencies.forEach(function (name) {
		b.require(name);
	});

	return b.bundle()
		.pipe(source('passwordmaker.js'))
		.pipe(buffer())
		.pipe(gulp.dest('js'));
});

gulp.task('zip', function () {
	gulp.src(files)
		.pipe(zip('passwordmaker.zip'))
		.pipe(gulp.dest('.'));
});

gulp.task('xpi', function () {
	gulp.src(files)
		.pipe(zip('passwordmaker.xpi'))
		.pipe(gulp.dest('.'));
});
