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
        paths = {
            root: './',
            dist: '001-diditaxi/dist/',
            source: '001-diditaxi/source',
            demo: '001-diditaxi',
        },
        template = {
            filename: 'index',
            pkg: require('./package.json'),
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
            port:'3000'
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
        return gulp.src(paths.dist + 'index.html').pipe(open({ uri: 'http://localhost:3000/' + paths.dist + 'index.html'}));
    });

    gulp.task('server', [ 'watch', 'connect', 'open' ]);

    gulp.task('default', [ 'server' ]);

})();