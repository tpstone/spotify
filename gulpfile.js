'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const injectSvg = require('gulp-inject-svg');

gulp.task('watch', function(){
	gulp.watch('./public/styles/**/*.scss', ['styles']);
	gulp.watch('./index.html', ['svg']);
});

gulp.task('styles', function(){
	return gulp.src('./public/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles/'))
});

gulp.task('svg', function(){
	return(gulp.src('./*.html'))
		.pipe(injectSvg())
		// should there be a copy of index.html in the public folder?
		.pipe(gulp.dest('.'));
});