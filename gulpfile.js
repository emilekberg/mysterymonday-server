const gulp = require('gulp');
const compile = require('./gulp/compile');


gulp.task('compile', compile);
gulp.task('watch', ['compile'], function() {
	gulp.watch('src/**/*.ts', ['compile']);
});
gulp.task('default', ['compile']);