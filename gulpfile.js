'use strict';

var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib');
var connect = require('gulp-connect');
var spritesmith = require('gulp.spritesmith');
var config = require('./config');

console.log('----------------------------');
console.log('mode: ', config.mode);
console.log('debug: ', config.debug);
console.log('----------------------------');

var path = {
	root: 'client/',
	bem: function () {
		return this.root + 'bem_components/'
	},
	img: function () {
		return this.root + 'img/'
	}
};

var scriptsCash = null;
var stylusCash = null;
var spriteData = null;

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

//sprite
gulp.task('sprite', function () {
   spriteData = gulp.src(path.img() + 'icons/source/**/*.*')
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.css'
		}))
		.pipe(gulp.dest(path.img() + 'icons/sprite/'));
		
  return spriteData;
});

//watch
gulp.task('watch', function () {
	gulp.watch(path.bem() + '**/*.js', ['scripts']);
	gulp.watch(path.bem() + '**/*.styl', ['stylus']);
	gulp.watch(path.root + '*.html', ['html']);
	gulp.watch(path.img() + 'icons/source/**/*.*', ['sprite']);
});

gulp.task('default', ['connect', 'scripts', 'stylus', 'html', 'sprite', 'watch']);

