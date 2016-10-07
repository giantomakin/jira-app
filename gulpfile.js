var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

var jsFiles = ['public/javascripts/controllers/*.js',
			   'public/javascripts/directives/*.js',
			   'public/javascripts/services/*.js',
			   'public/javascripts/*.js'
			  ],
    jsDest = 'public/dist/scripts';


gulp.task('scripts', function() {
    return gulp.src(jsFiles)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('app.min.js'))
        .pipe(ngAnnotate())
    	.pipe(uglify())
    	.pipe(gulp.dest(jsDest));
});
