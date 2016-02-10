var gulp = require('gulp');
var zip = require('gulp-zip');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');

var dependencies = ['passwordmaker', 'url', 'debounce'];

function files() {
	return gulp.src(['manifest.json', '*.html', 'css/**', 'font/**', 'img/**', 'js/**'], { base: '.' });
}

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
	files()
		.pipe(zip('passwordmaker.zip'))
		.pipe(gulp.dest('.'));
});

gulp.task('xpi', function () {
	files()
		.pipe(zip('passwordmaker.xpi'))
		.pipe(gulp.dest('.'));
});
