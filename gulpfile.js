var del = require('del');
//var buildProduction = require('utilities.env.production'); // Tells which kind of environment we are using
var utilities = require('gulp-util');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});
var browserSync = require('browser-sync').create();
var sass = reuire('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// Concat task
gulp.task('concatInterface', function(){
  return gulp.src(['./js/*-interface.js', './js/signup-interface.js']) // The wildcard symbol * shortens concatenation task
  .pipe(concat('allConcat.js'))
  .pipe(gulp.dest('./tmp'));
});

 // Browserify task
gulp.task('jsBrowserify', ['concatInterface'], function(){
  return browserify({ entries: ['./tmp/allConcat.js'] }) // File to be browserified
     .bundle() // Something built into Browserify package
     .pipe(source('app.js')) // A new file called app.js is created and put in a new folder
     .pipe(gulp.dest('./build/js')); // Location of where app.js will be, it will go in the js folder
});

// Minification task. It's The process of removing all unnecessary characters in JS files
gulp.task("minifyScripts", ["jsBrowserify"], function(){ // jsBrowserify becomes a dependency of our Minification task
  return gulp.src("./build/js/app.js") // app.js is minified after it was browserified
     .pipe(uglify())
     .pipe(gulp.dest("./build/js"));
});

// Clean task
gulp.task('clean', function() { // A task to clean up our environment before we make a build task
  return del(['build', 'tmp']); // We pass del an array of the paths to delete and it removes them
});

// Build task
gulp.task('build', function(){
  if (buildProduction) {
    gulp.start('minifyScripts'); // gulp.start is used  to trigger tasks based on conditional statements
  } else {
    gulp.start('jsBrowserify');
  }
  gulp.start('bower');
  gulp.start('cssBuild');
});

// jsHint task
gulp.task('jshint', function() {
  gulp.src(['js/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// BowerJs task
gulp.task('bowerJS', function() { // Our bowerJSS task
   return gulp.src(lib.ext('js').files) // The extension of the js files, gulp.src pulls in the javascript files,filtering out the .js files
  .pipe(concat('vendor.min.js')) // concatenated and minified vendor.js file
  .pipe(uglify())
  .pipe(gulp.dest('./build/js')); // Location of the vendor.js file
});

 // BowerCSS task;
 gulp.task('bowerCSS', function() {
   return gulp.src(lib.ext('css').files)
   .pipe(concat('vendor.css'))
   .pipe(gulp.dest('./build/css'));
 });

// Combination of bowerJS and bowerCSS
gulp.task('bower', ['bowerJS', 'bowerCSS']);

// Server begins here
// BrowerSync task
gulp.task('server', function() {
  browserSync.init({ // browserSync initialized and launches the local server
     server: {
       baseDir: "./", // The directory where the local server will be launched from
       index: "index.html" // The entry point where we want to start our app
     }
  });
  gulp.watch(['js/*.js'], ['jsBuild']); // We are watching the js files and if they change, jsBuild is run
  gulp.watch(['bower.json'], ['bowerBuild']); // Bower files are watched for changes
  gulp.watch(['*.html'], ['htmlBuild']); // Watches html pages for changes
  gulp.watch(['./scss*.scss'], [['cssBuild']]); // A watcher for changes in scss files
});

// jsBuild task with an array of dependency tasks that need to be run whenever any of the js files change.
gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function() {
   browserSync.reload(); // Reloads the browser
});

// bowerBuild task to watch the bower files for changes
gulp.task('bowerBuild', ['bower'], function() {
  browserSync.reload();
});

// htmlBuild task
gulp.task('htmlBuild', function() {
  browserSync.reload();
});

// cssBuild task with sass and soursemaps
gulp.task('cssBuild', function() { // This task loads all source files inside of our scss folder with the extension .scss.
  soursemaps.init() // sourcemaps.init method processes scss files
    return gulp.src(['./scss/*.scss'])
    .pipe(sass()) // The sass method translates our files into normal CSS,
    .pipe(soursemaps.write())
    .pipe(gulp.dest('./build/css'))
    .pipe(bowerSync.stream()); // We are auto-injecting our new CSS into the browser.
});
