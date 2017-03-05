'use strict';

var gulp            = require('gulp'),
    del             = require('del'),
    fs              = require('fs'),
    typescript      = require('gulp-typescript'),
    sourcemaps      = require('gulp-sourcemaps'),
    $               = require('gulp-load-plugins')({ lazy: true }),
    remapIstanbul   = require('remap-istanbul/lib/gulpRemapIstanbul'),
    config          = require('./gulp.config')();

/*******************************************************************************/
/* For the following tasks the plugins are directly required and are installed */
/* via package.json dependencies, since Heroku only installs these             */
/*******************************************************************************/

// clean build directory
gulp.task('clean', function doClean() {
    return del([
        config.paths.outDir + '**/*'
    ]);
});

// copy ressources
gulp.task('copyRessources', gulp.parallel(
    function doCopyRessources() {
        return gulp
            .src('./public/**/*.*', {base: '.'})
            .pipe(gulp.dest(config.paths.outDir));
    },
    function doCopyEnv(cb) {
        var envFile = './.env';
        if (fs.existsSync(envFile)) {
            return gulp
                .src(envFile)
                .pipe(gulp.dest(config.paths.outSourceDir));
        }
        cb();
    })
);

// compile typescript
gulp.task('compile', gulp.parallel('copyRessources', function doBuildApp() {
    var tsProject = typescript.createProject('tsconfig.json');
    return gulp
        .src([config.paths.sourcePattern])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('../srcmaps'))
        .pipe(gulp.dest(config.paths.outSourceDir));
}));

/*******************************************************************************/
/* All other plugins are in devDependecies, therefor not loaded in Heroku and  */
/* are lazy loaded in the following tasks to avoid gulp errors                 */
/* The only exception is remapIstanbul, since this module doesn't follow the   */
/* gulp-<name> pattern, which is required by gulp-load-plugins                 */
/*******************************************************************************/

// lint for code in source and test
gulp.task('lint', function doLint() {
    return gulp
        .src([
            config.paths.sourcePattern
        ])
        .pipe($.tslint({
            formatter: "verbose"
        }))
        .pipe($.tslint.report());
});

gulp.task('build', gulp.series('compile', 'lint'));

// run unit tests with coverage
gulp.task('unit-test-step', gulp.series(
    function doPreUnitTest() {
        return gulp
            .src([config.paths.outSourcePattern])
            .pipe($.istanbul())
            .pipe($.istanbul.hookRequire());
    }, function doUnitTest() {
        return gulp
            .src(config.paths.outUnitTestPattern)
            .pipe($.mocha({
                ui: 'bdd',
                timeout: 30000
            }))
            .pipe($.istanbul.writeReports({
                dir: config.paths.outCoverageDir + 'js-json',
                reporters: [ 'json'],
            }));
    }, function doPostUnitTest() {
        return gulp
            .src(config.paths.outCoverageDir + 'js-json/coverage-final.json')
            .pipe(remapIstanbul({
                reports: {
                    'json'          : config.paths.outCoverageDir + 'ts-json/coverage.json',
                    'html'          : config.paths.outCoverageDir + 'html-report',
                    'text-summary'  : ''
                }
            }));
    }));

gulp.task('integration-test-step',
    function doIntegrationTest() {
        return gulp
            .src(config.paths.outIntegrationTestPattern)
            .pipe($.mocha({
                ui: 'bdd'
            }));
    });

gulp.task('unit-test', gulp.series('compile', 'unit-test-step'));
gulp.task('integration-test', gulp.series('compile', 'integration-test-step'));
gulp.task('test', gulp.series('compile', 'unit-test-step', 'integration-test-step'));

// run and restart
gulp.task('serve', gulp.series('compile', function doServe() {
    $.nodemon(config.nodemon);
}));

// watcher
gulp.task('watch', gulp.series('compile', function doWatch() {
    gulp.watch([
        config.paths.sourcePattern
    ],
    function executeWatch(cb) {
        gulp.series('compile')(function wrappedCb(err) {
            cb();
        });
    })
}));

gulp.task('serve-debug', gulp.series('compile', function doServeDebug(done) {
    config.nodemon.exec = 'node --debug';
    $.nodemon(config.nodemon);
    done();
}));

gulp.task('scheduler', gulp.series('compile', function doScheduleDebug(done) {
    config.scheduler.exec = 'node --debug';
    $.nodemon(config.scheduler);
    done();
}));


// define default task
gulp.task('default', gulp.series('clean', 'build'));
