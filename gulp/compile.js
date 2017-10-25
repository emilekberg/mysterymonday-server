const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.json');
module.exports = function() {
	return tsResult = tsProject.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject()).js
		.pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: ''}))
		.pipe(gulp.dest('bin'));
};