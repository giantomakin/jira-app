var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');

var jsFiles = ['public/javascripts/controllers/*.js',
			   'public/javascripts/directives/*.js',
			   'public/javascripts/services/*.js',
			   'public/javascripts/*.js'
			  ],
    jsDest = 'public/dist/scripts';

gulp.task('default', ['watch']);

gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('app.min.js'))
        .pipe(ngAnnotate())
    	.pipe(uglify())
    	.pipe(gulp.dest(jsDest));
});

gulp.task('jshint', function() {
  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('watch', function() {
  gulp.watch(jsFiles, ['jshint','scripts']);
});

