const gulp = require('gulp'); // Подключаем gulp
const uglify = require("gulp-uglify"); // минифицирование js файлов
const concat = require("gulp-concat"); //склеивает файлы
const minifyCss = require("gulp-minify-css"); //Сжимает css
const imagemin = require('gulp-imagemin'); // оптимизация изображений 
const clean = require("gulp-clean"); //удаляет файл или папку
const shell = require("gulp-shell");// очередность запуска
const browserSync = require("browser-sync");//сервер
const reload = browserSync.reload; // перезагрузка сервера
const runSequence = require ("run-sequence") //запускает задачи поочереди 

const path = {
		src: {
			html: "app_hw-12/index.html",
			css: [ "app_hw-12/css/bootstrap/bootstrap.css" ,"app_hw-12/css/style.css"],
			js: [	"app_hw-12/js/libs/jquery-3.3.1.min.js",
					"app_hw-12/js/bootstrap.js"],
			images: "app_hw-12/img/**/*"
		},
		build: {
				html: 'build',
				js: 'build/js',
				css: 'build/css/',
				images: 'build/img'
		}
};

gulp.task("js", function() {
	return gulp.src(path.src.js)
		.pipe(uglify())
		.pipe(concat('main.js'))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task("css", function() {
	return gulp.src(path.src.css)
		.pipe(minifyCss())
		.pipe(concat("main.css"))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
})

gulp.task("html", function() {
	return gulp.src(path.src.html)
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
})

gulp.task("images", function() {
	return gulp.src(path.src.images)
	.pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.jpegtran({progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
	],	{
		verbose: true
	}))
	.pipe(gulp.dest(path.build.images))
});

gulp.task('clean', function(){
		return gulp.src('build')
			.pipe(clean());
})

gulp.task(
	'build', 
	shell.task([
		'gulp clean',
		'gulp images',
		'gulp html',
		'gulp css',
		'gulp js'
	])
);

gulp.task('browser-sync', function() {
		browserSync({
			startPath: '/',
			server: {
				baseDir: 'build'
			},
			notify: false
		});
})

gulp.task('watch', function() {
		gulp.watch('app_hw-12/*.html', ['html']);
		gulp.watch('app_hw-12/css/*.css', ['css']);
		gulp.watch('app_hw-12js/**/*.js', ['js']);
});

gulp.task('server', function() {
	runSequence('build', 'browser-sync', 'watch');
});


gulp.task('default', ['server']);
