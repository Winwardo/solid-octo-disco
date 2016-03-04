/*eslint-disable */
'use strict';

var path = require('path');
var gulp = require('gulp');
var semanticBuild = require('./semantic/tasks/build');
var webpack = require('webpack');
var nodemon = require('nodemon');
var webpackConfig = require('./webpack.config');

function onBuild(done) {
  return function(err, stats) {
    if (err) {
      console.log(err);
    } else {
      console.log(stats.toString());
    }

    if (done) {
      done(err);
    }
  };
}

gulp.task('build-semantic', semanticBuild);

// Gulp tasks definition begins.
gulp.task('build', ['build-semantic'], function(done) {
  webpack(webpackConfig).run(onBuild(done));
});

//for dev so that the build watcher doesn't rebuild semantic every time
gulp.task('build-quick', function(done) {
  webpack(webpackConfig).run(onBuild(done));
});

gulp.task('build-watch', ['build-quick'], function() {
  webpack(webpackConfig).watch(100, function(err, stats) {
    onBuild()(err, stats);
    nodemon.restart();
  });
});

gulp.task('run', ['build-watch'], function() {
  nodemon({
    execMap: {
      js: 'node',
    },
    script: path.join(__dirname, 'build/server'),
    ignore: ['*'],
    ext: 'js',
  }).on('restart', function() {
    console.log('Reloading Nodemon');
  });
});
/*eslint-enable */
