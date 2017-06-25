import './index.css';
import Library from './library';
import moment from 'moment';
import _ from 'lodash';
import $$$ from 'jquery'; // 这里引用的是script下载的jquery，没有打包到webpack中
require('demo-alias');

if (module.hot) {
    module.hot.accept(['./library'], function() {
        console.log('Accepting the updated library module!');
        Library.log();
    })
}

if (process.env.NODE_ENV == 'production') {
    console.log(process.env.NODE_ENV);
}

if (process.env.NODE_ENV == 'development') {
    console.log(process.env.NODE_ENV);
}

//commonjs异步加载
// require.ensure([], function(require) {
//     var a = require('./a.js');
// }, 'a');

//http://www.css88.com/doc/webpack2/guides/code-splitting-require/
//commonjs预加载懒执行
// require.ensure(['./a.js'], function(require) {
//     var a = require('./a.js');
// }, 'a');

//webpack自带的require.include
require.ensure([], function(require) {
    require.include('./a'); //此处只加载不执行
    var a = require('./a'); //执行
}, 'a');

function component() {
    var element = document.createElement('div');

    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

document.body.appendChild(component());

console.log(moment().format());

console.log($('#home').text());

console.log($$$('#home').text());

let me = 'aaa';
console.log(me);

function Point(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

var p = new Point();
console.log(p);
