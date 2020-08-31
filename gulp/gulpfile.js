'use strict';

const {
	src,
	dest,
	watch,
	series,
	parallel
} = require('gulp');
const Fiber = require('fibers');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const cssbeautify = require('gulp-cssbeautify');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const gulpif = require('gulp-if');
const options = require('gulp-options');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const imagemin = require('gulp-imagemin');
const del = require('del');

sass.compiler = require('sass');

const dirSrc = 'src';
const dirBuild = 'build';

const routes = {
	watch: {
		root: dirSrc,
		assets: {
			favicon: dirSrc + '/favicon/*',
			fonts: dirSrc + '/fonts/**/*',
			img: dirSrc + '/img/**/*'
		},
		pug: dirSrc + '/pug/index.pug',
		pugWatch: dirSrc + '/pug/**/*.pug',
		html: dirSrc + '/**/*.html',
		js: dirSrc + '/js/**/*.js',
		jsESLint: [dirSrc + '/js/**/*.js', '!' + dirSrc + '/js/libs/*.js'],
		css: dirSrc + '/css/**/*.css',
		sass: dirSrc + '/scss/**/*.scss',
		sassStylelint: [
			dirSrc + '/scss/**/*.scss',
			'!' + dirSrc + '/scss/libs/*.scss'
		]
	},
	dev: {
		root: dirSrc,
		js: dirSrc + '/js',
		css: dirSrc + '/css'
	},
	build: {
		root: dirBuild,
		files: dirBuild + '/**/*',
		assets: {
			favicon: dirBuild + '/favicon',
			fonts: dirBuild + '/fonts',
			img: dirBuild + '/img'
		},
		html: dirBuild,
		js: dirBuild + '/js',
		css: dirBuild + '/css'
	}
};

function browser() {
	browserSync.init({
		server: {
			baseDir: dirSrc
		},
		notify: false
	});
}

function devSassStyleLint() {
	return src(routes.watch.sassStylelint).pipe(
		// Проверка sass линтами
		stylelint({
			reporters: [{
				formatter: 'string',
				console: true
			}]
		}).on('error', notify.onError())
	); // Обновление страницы
}

function devSass() {
	return src(routes.watch.sass)
		.pipe(sourcemaps.init())
		.pipe(sass({
			fiber: Fiber
		}).on('error', notify.onError())) // Преобразование sass в css
		.pipe(autoprefixer(['last 15 versions'])) // Добавление префиксов
		.pipe(sourcemaps.write())
		.pipe(dest(routes.dev.css)) // Перемещение в папку css
		.pipe(browserSync.stream()); // Обновление страницы
}

function devJs() {
	return src(routes.watch.jsESLint)
		.pipe(
			// Проверка линтом
			eslint({
				globals: ['jQuery', '$']
			})
		)
		.pipe(eslint.format()) // Вывод ошибок в консоль
		.pipe(browserSync.reload({
			stream: true
		}));
}

function devHtml() {
	return src(routes.watch.html).pipe(browserSync.reload({
		stream: true
	}));
}

function devPug() {
	return src(routes.watch.pug)
		.pipe(pug({
			pretty: true
		}))
		.pipe(dest(dirSrc));
}

function clean() {
	return del(routes.build.root); // Очистка папки build
}

const isNoMinCss = function (file) {
	return !options.has('no-min') && file.basename.indexOf('.min.css') === -1;
};

function buildCss() {
	return src(routes.watch.css)
		.pipe(gulpif(isNoMinCss, cleanCSS(), cssbeautify({
			indent: '	'
		}))) // Минификация кода
		.pipe(gulpif(isNoMinCss, rename({
			suffix: '.min',
			prefix: ''
		}))) // Добавление суффикса .min к названию файла
		.pipe(dest(routes.build.css)); // Перемещение в папку build
}

const isNoMinJs = function (file) {
	return !options.has('no-min') && file.basename.indexOf('.min.js') === -1;
};

function buildJs() {
	return src(routes.watch.js)
		.pipe(gulpif(isNoMinJs, uglify())) // Минификация кода
		.pipe(gulpif(isNoMinJs, rename({
			suffix: '.min',
			prefix: ''
		}))) // Добавление суффикса .min к названию файла
		.pipe(dest(routes.build.js)); // Перемещение в папку build
}

function buildHtml() {
	return src(routes.watch.html)
		.pipe(
			gulpif(
				!options.has('no-min'),
				// eslint-disable-next-line no-useless-escape
				replace(/(src|href)=\".+(\.css|\.js)\"/g, function (match) {
					let res = match;
					if (match.indexOf('.js') !== -1) {
						if (match.indexOf('.min.js') === -1) {
							res = match.replace(/\.js/g, '.min.js');
						}
					}
					if (match.indexOf('.css') !== -1) {
						if (match.indexOf('.min.css') === -1) {
							res = match.replace(/\.css/g, '.min.css');
						}
					}
					return res;
				})
			)
		)
		.pipe(dest(routes.build.html)); // Перемещение в папку build
}

function buildAssetsFavicon() {
	return src(routes.watch.assets.favicon)
		.pipe(dest(routes.build.assets.favicon)); // Перемещение в папку build
}

function buildAssetsFonts() {
	return src(routes.watch.assets.fonts)
		.pipe(dest(routes.build.assets.fonts)); // Перемещение в папку build
}

function buildAssetsImg() {
	return src(routes.watch.assets.img)
		.pipe(imagemin()) //сжатие изображений
		.pipe(dest(routes.build.assets.img)); // Перемещение в папку build
}

function watcher() {
	watch(routes.watch.sass, parallel(devSassStyleLint, devSass));
	watch(routes.watch.js, devJs);
	watch(routes.watch.pugWatch, devPug);
	watch(routes.watch.html, devHtml);
}

exports.build = series(
	clean,
	buildAssetsFavicon,
	buildAssetsFonts,
	buildAssetsImg,
	buildHtml,
	buildJs,
	devSass,
	buildCss
);

exports.default = parallel(
	devPug,
	devSassStyleLint,
	devSass,
	devJs,
	browser,
	watcher
);
