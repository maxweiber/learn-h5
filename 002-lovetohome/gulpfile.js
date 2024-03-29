(function(){
    'use strict';
    var gulp = require('gulp'),
        connect = require('gulp-connect'),
        open = require('gulp-open'),
        rename = require('gulp-rename'),
        header = require('gulp-header'),
        path = require('path'),
        uglify = require('gulp-uglify'),
        sourcemaps = require('gulp-sourcemaps'),
        jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish'),
        minifycss = require('gulp-minify-css'),
        imagemin = require('gulp-imagemin'),
        pngcrush = require('imagemin-pngcrush'),
        md5 = require('gulp-md5-plus'),
        htmlmin = require('gulp-htmlmin'),
        rev = require('gulp-rev'),
        revCollector = require('gulp-rev-collector'),
        autoprefixer = require('autoprefixer'),
        postcss = require('gulp-postcss'),
        cssnano = require('gulp-cssnano'),
        minifyHTML = require('gulp-minify-html'),
        paths = {
            root: './',
            dist: 'dist/',
            source: 'source',
            demo: '',
        },
        template = {
            filename: 'index',
            pkg: require('../package.json'),
            banner: [
                '/**',
                ' * <%= pkg.name %> <%= pkg.version %>',
                ' * <%= pkg.description %>',
                ' * ',
                ' * <%= pkg.homepage %>',
                ' * ',
                ' * Copyright <%= date.year %>, <%= pkg.author %>',
                ' * sunpeijun',
                ' * http://www.sunpeijun.com/',
                ' * ',
                ' * Licensed under <%= pkg.license.join(" & ") %>',
                ' * ',
                ' * Released on: <%= date.month %> <%= date.day %>, <%= date.year %>',
                ' */',
                ''].join('\n'),
            date: {
                year: new Date().getFullYear(),
                month: ('January February March April May June July August September October November December').split(' ')[new Date().getMonth()],
                day: new Date().getDate()
            }
        };



    gulp.task('dist', function (cb) {

        gulp.src(paths.source + '/scripts/index.js')
            .pipe(sourcemaps.init())
            .pipe(header(template.banner, { pkg : template.pkg, date: template.date } ))
            .pipe(uglify())
            .pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(sourcemaps.write('./'))

            .pipe(rev())    // 计算md5
            .pipe(gulp.dest(paths.dist + '/scripts'))

            .pipe(rev.manifest())
            .pipe(gulp.dest(paths.dist + '/rev'))

            .pipe(connect.reload())

        cb();
    });

    gulp.task('rev', function() {
      gulp.src([paths.dist + '/rev/*.json', paths.dist + '/index.html'])
        .pipe(revCollector())
        // .pipe(rename(paths.dist + 'index.min.html'))
        .pipe(gulp.dest(paths.dist));

    });

    gulp.task('watch', function () {
        gulp.watch(paths.source + '/scripts/index.js', [ 'dist' ]);
    });

    gulp.task('connect', function () {
        return connect.server({
            root: [ paths.root ],
            livereload: true,
            port:'4000'
        });
    });

    gulp.task('minifyhtml', function() {
      return gulp.src(paths.source + '/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.dist));
    });

    gulp.task('minifyimg', function() {
      return gulp.src(paths.source + '/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest(paths.dist + '/images/'));
    });

    gulp.task('open', function () {
        return gulp.src(paths.source + '/index.html').pipe(open({ uri: 'http://localhost:4000/' + paths.source + '/index.html'}));
    });

    // auto mini css
    gulp.task('autoprefixer', function () {
        var postcss      = require('gulp-postcss');
        var sourcemaps   = require('gulp-sourcemaps');
        var autoprefixer = require('autoprefixer');

        return gulp.src('./source/styles/index.css')
            .pipe(sourcemaps.init())
            .pipe(postcss([ autoprefixer({ browsers: ['> 1%'], remove: false }) ]))
            .pipe(minifycss())
            .pipe(sourcemaps.write('.'))


            .pipe(rev())
            .pipe(gulp.dest('./source/styles/'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('./source/styles/rev'));

            // .pipe(rename({suffix: '.min'}))

            // .pipe(gulp.dest('./source/styles/'));

            // gulp.src(['./source/styles/rev/*.json', './source/index.html'])
            // .pipe(revCollector())
            // .pipe(rename({suffix: '.min'}))
            // .pipe(gulp.dest('./source/'));

    });

    gulp.task('rev', function () {
        return gulp.src(['./source/styles/rev/*.json', './source/index.html'])
            .pipe(revCollector())
            .pipe( minifyHTML({
                empty:true,
                spare:true
            }) )
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest('./source/'));
    });

    gulp.task('server', [ 'watch', 'connect', 'open' ]);

    gulp.task('default', [ 'server' ]);

})();