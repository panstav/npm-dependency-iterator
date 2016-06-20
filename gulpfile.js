const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

gulp.task('sass', () => {

	return gulp.src('client/index.sass')
		.pipe(plugins.sass({ outputStyle: 'nested', errLogToConsole: true, sourceComments : 'normal' }))
		.pipe(plugins.rename({ basename: 'styles' }))
		.pipe(gulp.dest('public'));

});

gulp.task('js', () => {

	return gulp.src('client/index.js')
		.pipe(plugins.browserify())
		.pipe(plugins.babel({ presets: ['es2015'] }))
		.pipe(plugins.rename({ basename: 'scripts' }))
		.pipe(gulp.dest('public'));

});

gulp.task('pug', () => {

	return gulp.src('client/shell.pug')
		.pipe(plugins.pug({ pretty: true }))
		.pipe(plugins.rename({ basename: 'index' }))
		.pipe(gulp.dest('public'));

});

gulp.task('build', plugins.sequence('sass', 'js', 'pug'));