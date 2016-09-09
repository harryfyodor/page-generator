var gulp = require('gulp');
var fontSpider = require('gulp-font-spider');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var notify = require('gulp-notify');
var browserSync = require('browser-sync');
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var pump = require('pump');

// font-spider启动
gulp.task('fontspider', function() {
	return gulp.src('./index.html')
		.pipe(fontSpider())
		.pipe(notify({ message: "Fontspider task completed." }));
});

// 支持commonjs，并且合并成单文件
gulp.task('browserify', function(){
	browserify({
		entries: ['./src/js/main.js', './src/js/eventEmmiter3.js', './src/js/utils.js'],
		debug: true
	})
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'))
		.pipe(notify({message: 'browserify task completed.'}));
});

gulp.task('scripts', ['browserify'], function() {

	pump([
		gulp.src('dist/js/bundle.js'),
		uglify(),
		rename({ suffix: '.min' }),
		gulp.dest('dist/js'),
		notify({message: 'scripts task completed.'})
	]);
});

// browser-sync，自动刷新
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./"
		}
	});
});

// 编译handlebars
gulp.task('hbs', function() {
	var json = require('./data.json');

	var markdownify = function(json) {
		var str = JSON.stringify(json);

		return JSON.parse(
			str
				.replace(/`([^`]+)`/g, '<code>$1</code>')
				.replace(/(\*{2})(.*?)\1/g, '<strong>$2</strong>')
		);
	};

	json = markdownify(json);

	var listGenerator = function(begin, end, options, items){
		var out = "<ul>";
		for(var i=begin, l=end; i<l; i++) {
			out = out + "<li>" + options.fn(items[i]) + "</li>";
		}
		return out + "</ul>";
	};
	var options = {
		ignorePartials: true,
		helpers: {
			doubleList: function(items, opts){
				if(items.length === 1) return listGenerator(0, 1, opts, items);

				var listLeft = "<ul>";
				var listRight = "<ul>";

				for (var i = 0, len = items.length; i < len; i++) {
					if(i%2 === 0) {
						listLeft += "<li>" + opts.fn(items[i]) + "</li>";
					} else {
						listRight += "<li>" + opts.fn(items[i]) + "</li>";
					}
				}

				listLeft += "</ul>";
				listRight += "</ul>"

				return listLeft + listRight;
			},
			list: function(items, opts) {
				return listGenerator(0, items.length, opts, items);
			}
		}
	}
	return gulp.src('./template.handlebars')
		.pipe(handlebars(json, options))
		.pipe(rename('index.html'))
		.pipe(gulp.dest("./"));
});

gulp.task('styles', function(){
	return gulp.src('src/scss/style.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('dist/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/css'))
		.pipe(notify({ message: 'Styles task completed.' }));
});

gulp.task('images', function(){
	return gulp.src('src/images/*')
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('dist/images'))
		.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('default', ['hbs', 'scripts', 'styles', 'images']);