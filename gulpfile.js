var gulp = require('gulp');
var sass = require('gulp-sass');
var csscomb = require('gulp-csscomb');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var reload = browserSync.reload;
var mkdirp = require('mkdirp');
var connectPHP = require('gulp-connect-php');


/*Définition des paths du site*/
var path ={
	src : {
		styles: './src/sass/',
		scripts: './src/js/',
		images: './src/img/',
		html: './src/html/*.html',
		php: './src/html/*.php'
	},
	dist : {
		styles: './dist/css/',
		scripts: './dist/js/',
		images: './dist/img/',
		html: './dist/',
		php: './dist/'
	},
	maps : '../maps/'
};


gulp.task('connect', function() {
  connectPHP.server({
    hostname: 'localhost',
    bin: 'D:/Logiciels/UwAmp/bin/php/php-5.6.18/php.exe', //A modifié selon la config
    ini: 'D:/Logiciels/UwAmp/bin/apache/php.ini',   //A modifié selon la config
    port: 8000,
    base: 'dist',
    open: 'true'
  });
});

//Creation de l'arborescence
gulp.task('mkdir', function(){
	mkdirp(path.src.styles);
	mkdirp(path.src.scripts);
	mkdirp(path.src.scripts+ 'vendors');
	mkdirp(path.src.scripts+ 'plugins');
	mkdirp(path.src.images);
	mkdirp(path.src.html);
});

/*Tâche GULP =  */
gulp.task('sass',function(){
	return gulp.src(path.src.styles+"main.scss") /*récupère le fichier source*/
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'], /*nb de versions à préfixer ici 2*/
			cascade: false})) /*Affichage en cascade ou pas*/
		.pipe(sass({
				outputStyle: 'compressed'/*compilation en compréssé*/
			}).on('error',sass.logError))
		.pipe(csscomb())
		.pipe(sourcemaps.write(path.maps))
		.pipe(gulp.dest(path.dist.styles)) /*répertoire de destination*/
		.pipe(browserSync.stream())
		.pipe(notify({ message: 'Style task complete' }))
});

/*Tâche javascripts :*/
gulp.task('scripts',function(){
	return gulp.src([
		path.src.scripts + 'vendors/*.js',
		path.src.scripts + 'plugins/*.js',
		path.src.scripts + '*.js'
		]) /*récupère le fichier source*/
		.pipe(sourcemaps.init())
		.pipe(uglify({
			preserveComments: 'some'  /*garde les  commentaires /*! */
		}))
		.pipe(concat('main.min.js')) /*fichier de sortie*/
		.pipe(sourcemaps.write(path.maps))
		.pipe(gulp.dest(path.dist.scripts)) /*répertoire de destination*/
		.pipe(browserSync.stream())
		.pipe(notify({ message: 'Scripts task complete' }))
});

gulp.task('images', function() {
	return gulp.src(path.src.images)
	.pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
	.pipe(gulp.dest(path.dist.images))
	.pipe(browserSync.stream())
	.pipe(notify({ message: 'Images task complete' }))

});

// Copy all static assets
gulp.task('html', function() {
  	return gulp.src(path.src.html)
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'HTML task complete' }))
});

// Copy all static assets
gulp.task('php', function() {
  	return gulp.src(path.src.php)
    .pipe(gulp.dest(path.dist.php))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'PHP task complete' }))
});

/* Watch: permet de bosser sans avoir
* à relancer les commandes en CLI
*/
gulp.task('watch', function () {

	browserSync({

		server: {
		    baseDir: "dist",
		    index: "index.html"
		    //directory: true
		},
		// Open the site in Chrome
		browser: "google chrome"
		// Open the site in Chrome & Firefox
		//browser: ["google chrome", "firefox"]

   });
});

gulp.task('update', function() {
		gulp.watch('./src/sass/**/*.scss', ['sass']);
	  	gulp.watch('./src/js/**/*.js', ['scripts']);
	  	gulp.watch('./src/img/*', ['images']);
	  	gulp.watch('./src/html/*', ['html','php']);
});



gulp.task('build',['sass','scripts','images','html','php'],function(){});
gulp.task('default',['build','watch','update'],function(){});
gulp.task('php-connect',['connect','update'],function(){});