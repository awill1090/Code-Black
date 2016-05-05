var gulp           = require('gulp');
var markdown       = require('gulp-markdown');
var htmlmin        = require('gulp-htmlmin');
var connect        = require('gulp-connect');
var sequence       = require('gulp-sequence');
var frontMatter    = require('gulp-front-matter');
var nunjucksRender = require('gulp-nunjucks-render');
var data           = require('gulp-data');
var fs             = require('fs');
var through2       = require('through2');
var wrap           = require('gulp-wrap');
var sass           = require('gulp-sass');

var site = {};

var collectPosts = function() {
  var posts = [];

  return through2.obj(function(file, enc, cb) {
    var post = file.page;
    post.content = file.contents.toString();
post.title = "some shit here";
post.subtitle = "a subtitle heresome shit here";
post.date = "2016/12/12"
    posts.push(post);
    this.push(file);
    cb();
  }, function(cb) {
    site.posts = posts;
    cb();
  });
};

gulp.task('posts', function() {
  return gulp.src('src/posts/**/*.md')
             .pipe(frontMatter({property: 'page', remove: true}))
             .pipe(markdown())
             .pipe(collectPosts())
             .pipe(wrap(function(data) {
               return fs.readFileSync('src/templates/blog.html').toString();
             }, null, {engine: 'nunjucks'}))
             .pipe(htmlmin({collapseWhitespace: true}))
             .pipe(gulp.dest('dist/blog'))
             .pipe(connect.reload());
});

gulp.task('pages', function() {
  return gulp.src('src/pages/**/*.html')
             .pipe(data({site: site}))
             .pipe(nunjucksRender({ path: ["src/templates/"] }))
             .pipe(htmlmin({collapseWhitespace: true}))
             .pipe(gulp.dest('dist/'))
             .pipe(connect.reload());
});

gulp.task('sass', function() {
  return gulp.src('src/css/**/*.scss')
             .pipe(sass())
             .pipe(gulp.dest('dist/css'));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
             .pipe(gulp.dest('dist/img'));
});

gulp.task('script', function() {
  return gulp.src('src/js/**/*.js')
             .pipe(gulp.dest('dist/js'));
});


// add a watch task so when files change we dont have to restart gulp every time

gulp.task('serve', function() {
  connect.server({
    root: ['dist'],
    port: 3000,
    livereload: true,
    directory: false
  });
});

gulp.task('default', sequence('images', 'sass', 'script', 'posts', 'pages', 'serve'));
