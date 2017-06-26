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

//es6 -- bable 自动转换测试
let me = 'aaa';
console.log(me);

function Point(x = 0, y = 0) {
    this.x = x;
    this.y = y;
}

var p = new Point();
console.log(p);

//es6 -- Promise
//---- 1 ----
function timeout(ms) {
    console.log('Promise1');
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
    });
}

timeout(2000).then((value) => {
    console.log(value);
});
//---- 2 -----Promise 新建后立即执行，所以首先输出的是Promise。然后，then方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以Resolved最后输出。
let promise = new Promise((resolve, reject) => {
    console.log('Promise2');
    resolve();
});

promise.then(function() {
    console.log('Resolved.');
});

console.log('Hi!');
//---- 3 -----异步加载图片
function loadImageAsync(url) {
    return new Promise((resolve, reject) => {
        var image = new Image();

        image.onload = function() {
            resolve(image);
        };

        image.onerror = function() {
            reject(new Error('Could not load image at ' + url));
        };

        image.src = url;
    });
}
loadImageAsync('http://59.110.112.73:81/assets/upload/auctionsite/20b024dc5163c11f4634a406fec12468.jpg').then((value) => {
    console.log(value);
});
//---- 4 ----
var p1 = new Promise(function(resolve, reject) {
    setTimeout(() => resolve('haha'), 3000);
    //setTimeout(() => reject(new Error('fail')), 3000)
});

var p2 = new Promise(function(resolve, reject) {
    setTimeout(() => resolve(p1), 1000);
});

p2.then(function(result) {
        console.log(result);
        return 'wuwu'; //传递给链式的then
    }, function(error) {
        console.log(error);
        return error;
    })
    .then(function(data) { //链式的data是上一个then传递过来的
        console.log('链式then:' + data);
    });

//----Set 数据结构----
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

// for (let i of s.values()) {
//     console.log(i);
// }
for (let i of s) {
    console.log(i);
}

// const set = new Set([1, 2, 3, 4, 4]);
// console.log([...set]);

function divs() {
    return [...document.querySelectorAll('div')];
}
const set = new Set(divs());
console.log(set.size + '个div');

// 使用Set实现数组去重
function dedupe(array) {
    return Array.from(new Set(array));
}
var dedupeResult = dedupe([1, 1, 2, 3]) // [1, 2, 3]
console.log('去重后的数组:' + dedupeResult);

let setType = new Set();
setType.add(3).add(5).add(2);
console.log(setType); //{3, 5, 2}
setType = new Set([...setType].filter(x => (x % 2) === 0));
console.log(setType);

let setType2 = new Set([1, 2, 3, 4]);
console.log(setType2); //{1, 2, 3, 4}
console.log([...setType2]); // [1, 2, 3, 4]
setType2 = new Set([...setType2].map(x => x * 2));
console.log(setType2); //{2, 4, 6, 8}
console.log(Array.from(setType2)); //[2, 4, 6, 8]

// ---- map ----
const map = new Map([
    ['name', '张三'],
    ['title', 'Author']
]);

console.log(map.size); // 2
console.log(map.has('name')); // true
console.log(map.get('name')); // "张三"
console.log(map.has('title')); // true
console.log(map.get('title')); // "Author"
