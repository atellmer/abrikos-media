'use strict';

var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib');
var connect = require('gulp-connect');
var config = require('./config');

console.log('----------------------------');
console.log('mode: ', config.mode);
console.log('debug: ', config.debug);
console.log('----------------------------');


var path = {
	root: 'client/',
	bem: function () {
		return this.root + 'bem_components/'
	}
};

var scriptsCash = null;
var stylusCash = null;

//connect
gulp.task('connect', function () {
	connect.server({
		root: 'client',
		port: 3000,
		livereload: true
	});
});

//js
gulp.task('scripts', function () {
	return gulp.src(path.bem() + '**/*.js')
		.pipe(connect.reload());
});

//stylus
gulp.task('stylus', function () {
	stylusCash = gulp.src(path.bem() + '**/*.styl');
	
	if (config.debug) {
		stylusCash = stylusCash
			.pipe(stylus({
				use: [nib()],
				compress: false
			}));		
	} else {
		stylusCash = stylusCash
			.pipe(stylus({
				use: [nib()],
				compress: true
			}));		
	}
	
	stylusCash = stylusCash.pipe(gulp.dest(function (file) {
				return file.base;
			}))
			.pipe(connect.reload());
			
	return stylusCash;
});

//html
gulp.task('html', function () {
	return gulp.src(path.root + '*.html')
		.pipe(connect.reload());
});

//watch
gulp.task('watch', function () {
	gulp.watch(path.bem() + '**/*.js', ['scripts']);
	gulp.watch(path.bem() + '**/*.styl', ['stylus']);
	gulp.watch(path.root + '*.html', ['html']);
});

gulp.task('default', ['connect', 'scripts', 'stylus', 'html', 'watch']);

