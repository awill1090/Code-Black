var gulp     = require('gulp');
var markdown = require('gulp-markdown');
var htmlmin  = require('gulp-htmlmin');
var connect  = require('gulp-connect');
var sequence = require('gulp-sequence');

gulp.task('posts', function() {
  return gulp.src('src/posts/**/*.md')
             .pipe(markdown())
             .pipe(htmlmin({collapseWhitespace: true}))
             .pipe(gulp.dest('dist/blog'))
             .pipe(connect.reload());
});

gulp.task('serve', function() {
  connect.server({
    root: ['dist'],
    port: 3000,
    livereload: true
  });
});

gulp.task('pages', function() {
  return gulp.src('src/pages/**/*.html')
             .pipe(htmlmin({collapseWhitespace: true}))
             .pipe(gulp.dest('dist/'))
             .pipe(connect.reload());
});

gulp.task('default', sequence('posts', 'pages', 'serve'));
