//*********** CONFIG PROJECT *******************\\
var config = {
	builType 	:'php', //for php server type 'php'
	buildDir 	:'dist/',
	ProjectName : ''
}


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
var phpMinify = require('gulp-php-minify');
var htmlminify = require("gulp-html-minify");

/*Définition des paths du site*/
var path ={
	src : {
		styles: './src/sass/',
		scripts: './src/js/',
		images: './src/img/',
		html: './src/html/**/*.html',
		php: './src/html/**/*.php'
	},
	dist : {
		styles: config.buildDir+'/css/',
		scripts: config.buildDir+'/js/',
		images: config.buildDir+'/img/',
		html: config.buildDir+'/',
		php: config.buildDir+'/'
	},
	maps : '../maps/'
};


//Creation de l'arborescence
gulp.task('mkdir', function(){
	mkdirp(path.src.styles);
	mkdirp(path.src.scripts);
	mkdirp(path.src.scripts+ 'vendors');
	mkdirp(path.src.scripts+ 'plugins');
	mkdirp(path.src.images);
	mkdirp(path.src.html);
});

/*Tâche SASS =  */
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
  	.pipe(htmlminify())
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.stream())
    //.pipe(notify({ message: 'HTML task complete' }))
});

/*Tâche PHP =  */
gulp.task('php', function() {
  	return gulp.src(path.src.php)
  	.pipe(phpMinify({binary: 'C:\\Users\\mathi\\Desktop\\Logiciels\\uwamp\\bin\\php\\php-5.4.31\\php.exe'}))
    .pipe(gulp.dest(path.dist.php))
    .pipe(browserSync.stream())
    //.pipe(notify({ message: 'PHP task complete' }))
});


/* Watch: permet de bosser sans avoir
* à relancer les commandes en CLI
*/
gulp.task('watch', function() {

if (config.builType==='php') {
  connectPHP.server({
    //hostname: 'localhost',
    bin: 'C:/Users/mathi/Desktop/Logiciels/uwamp/bin/php/php-5.4.31/php.exe', //A modifié selon la config
    ini: 'C:/Users/mathi/Desktop/Logiciels/UwAmp/bin/apache/php.ini',   //A modifié selon la config
    //port: 8000,
    base: config.buildDir}, function (){
    browserSync({
    	proxy: '127.0.0.1:8000',
    	// Open the site in Chrome
    	browser: "google chrome",
    	logPrefix: config.ProjectName
  	});
   });
  } else {

  	browserSync({

  			server: {
  			    baseDir: config.buildDir,
  			    index: 'index.html' //fichier par défaut
  			    //directory: true
  			},
  			// Open the site in Chrome
  			browser: "google chrome",
  			logPrefix: config.ProjectName
  			// Open the site in Chrome & Firefox
  			//browser: ["google chrome", "firefox"]

  	   });
  }

  	gulp.watch('./src/sass/**/*.scss', ['sass']);
	gulp.watch('./src/js/**/*.js', ['scripts']);
	gulp.watch('./src/img/*', ['images']);
	gulp.watch('./src/html/**/*.html', ['html']);
	gulp.watch('./src/html/**/*.php', ['php']);
	// stop old version of gulp watch from running when you modify the gulpfile
	gulp.watch("gulpfile.js").on("change", () => process.exit(0)); 


});



gulp.task('init',['mkdir','default'],function(){});
gulp.task('build',['sass','scripts','images','html','php'],function(){});
gulp.task('default',['build','watch'],function(){});


