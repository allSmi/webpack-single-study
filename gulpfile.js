var gulp = require('gulp');
var del = require('del');
var exec = require('child_process').exec;

// 清理构建目录
gulp.task('clean', function(callback) {
    del(['dist']);
    callback();

    // Return the Promise from del()
    // 'return' This is the key here, to make sure asynchronous tasks are done!
    // return del('dist/**/*');
});

// 生成编译后的文件
gulp.task('dev', ['clean'], function() {
    exec('npm run build:dev');
});

// 开启本地服务器
gulp.task('start', function() {
    exec('npm run start1');
});

gulp.task('default', ['start'], function() {
    // 将你的默认的任务代码放在这
});
