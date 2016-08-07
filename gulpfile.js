const gulp = require('gulp');
const zip = require('gulp-zip');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const required = require('gulp-required');

let b;

gulp.task('required', () => {
	b = browserify();

	return gulp.src(['js/**', '!js/passwordmaker.js'])
	.pipe(buffer())
	.pipe(required())
	.on('data', (deps) => {
		b.require(deps);
	});
});

gulp.task('browserify', ['required'], () => {
	return b.bundle()
	.pipe(source('passwordmaker.js'))
	.pipe(gulp.dest('js'));
});

gulp.task('zip', () => {
	return gulp.src(['manifest.json', '*.html', 'css/**', 'font/**', 'img/**', 'js/**'], { base: '.' })
	.pipe(zip('passwordmaker.zip'))
	.pipe(gulp.dest('.'));
});
