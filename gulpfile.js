var gulp = require('gulp');
var del = require('del');
var exec = require('child_process').exec;
var argv = require('yargs').argv;
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');

// 清理构建目录
gulp.task('clean', function(callback) { //https://github.com/sindresorhus/del/issues/50  http://www.tuicool.com/articles/VZfayer
    // del.sync(['dist']);
    // callback();

    // Return the Promise from del()
    // 'return' This is the key here, to make sure asynchronous tasks are done!
    return del(['dist']);
});

// 生成编译后的文件
gulp.task('dev', ['clean'], function(callback) {
    exec('npm run build:dev', function(err, stdout, stderr) {
        if (err) throw err;
        else console.log(stderr, stdout);
        callback();
    });
});

// 开启本地服务器
gulp.task('start', function() {
    exec('npm run start:dev', function(err, stdout, stderr) {
        if (err) throw err;
        else console.log(stdout, stderr);
    });
});

gulp.task('default', ['clean'], function() {
    // 将你的默认的任务代码放在这
    // return gulp.src('src/**/*')
    //     .pipe(gulpWebpack(require('./webpack.config.js'), webpack))
    //     .pipe(gulp.dest('dist/'));

    // gulp --pro  通过cmd命令传入变量,如果传入那么argv.pro === true,否则false
    if (argv.pro) {
        console.log('pro');
    } else {
        console.log('dev');
    }
});

// 书写说明
gulp.task('help', function() {
    console.log('   gulp dev          测试环境文件打包');
    console.log('   gulp help           gulp参数说明');
    console.log('   gulp start         开启本地服务器');
    console.log('   gulp         运行默认任务');
});
