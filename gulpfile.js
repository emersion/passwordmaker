var gulp = require('gulp');
var zip = require('gulp-zip');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var required = require('gulp-required');

var b;

gulp.task('required', function () {
	b = browserify();

	return gulp.src(['js/**', '!js/passwordmaker.js'])
	.pipe(buffer())
	.pipe(required())
	.on('data', function (deps) {
		b.require(deps);
	});
});

gulp.task('browserify', ['required'], function () {
	return b.bundle()
	.pipe(source('passwordmaker.js'))
	.pipe(gulp.dest('js'));
});

function files() {
	return gulp.src(['manifest.json', '*.html', 'css/**', 'font/**', 'img/**', 'js/**'], { base: '.' });
}

gulp.task('zip', function () {
	return files()
	.pipe(zip('passwordmaker.zip'))
	.pipe(gulp.dest('.'));
});

gulp.task('xpi', function () {
	return files()
	.pipe(zip('passwordmaker.xpi'))
	.pipe(gulp.dest('.'));
});
