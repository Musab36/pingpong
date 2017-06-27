var del = require('del');
var buildProduction = require('utilities.env.production'); // Tells which kind of environment we are using
var utilities = require('gulp-util');
var concat = require('gulp-concat');

// Concat task
gulp.task('concatInterface', function(){
  return gulp.src(['./js/*-interface.js', './js/signup-interface.js']) // The wildcard symbol * shortens concatenation task
  .pipe(concat('allConcat.js'))
  .pipe(gulp.dest('./tmp'));
});

 // Browserify task

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulp = require('gulp');

gulp.task('jsBrowserify', ['concatInterface'], function(){
  return browserify({ entries: ['./tmp/allConcat.js'] }) // File to be browserified
     .bundle() // Something built into Browserify package
     .pipe(source('app.js')) // A new file called app.js is created and put in a new folder
     .pipe(gulp.dest('./build/js')); // Location of where app.js will be, it will go in the js folder
});

// Minification task. It's The process of removing all unnecessary characters in JS files
var uglify = require('gulp-uglify');

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
    gulp.start('bower');
  }
});

// jsHint task
var jshint = require('gulp-jshint');

gulp.task('jshint', function() {
  gulp.src(['js/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Bower files task
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

gulp.task('bowerJS', function(){ // Our task
  return gulp.src(lib.ext('js').files) // We are filtering out only the .js files by using the ext method built into bower-files.
  .pipe(concat(vendor.min.js)) // concatenated and minified file
  .pipe(uglify())
  .pipe(gulp.dest('./build/js')); // We put the finished file into our build/js directory.
});


gulp.task('bowerCSS', function(){
  return gulp.src(lib.ext('css').files))
  .pipe(concat('vendor.css'))
  .pipe(uglify())
  .pipe(gulp.dest('./build/css'));
});

gulp.task('bower', ['bowerJS', 'bowerCSS']);
