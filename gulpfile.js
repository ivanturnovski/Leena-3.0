const gulp = require('gulp');
const themeKit = require('@shopify/themekit');
var sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean-css');

gulp.task('sass', function () {
	return gulp
		.src('sass/custom.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(clean({ compatibility: 'ie11' }))
		.pipe(gulp.dest('assets'));
});


gulp.task('watch', function () {
	gulp.watch('sass/**/*.scss', gulp.series('sass'));
	themeKit.command('watch', {
		allowLive: true,
		env: 'development',
	});
});
