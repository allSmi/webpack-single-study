//vendor库：第三方的代码的意思（其他供应商提供的代码）
var path = require('path');
var webpack = require('webpack');
var EVN; // 环境变量

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var WebpackMd5Hash = require('webpack-md5-hash'); //webpack 1 中chunkhash计算规则有问题，所有需要使用这个插件，webpack 2 已经修复了,经过我的使用，还是必须要使用这个插件

// 根据传入参数区分开发和生产环境
if (process.env.NODE_ENV == 'dev') {
    EVN = {
        'process.env.NODE_ENV': JSON.stringify('development')
    }
} else {
    EVN = {
        'process.env.NODE_ENV': JSON.stringify('production')
    }
}

module.exports = {
    // entry: './src/index.js',
    // output: {
    //     filename: 'bundle.js',
    //     path: path.resolve(__dirname, 'dist')
    // },
    entry: {
        index: './src/index.js',
        vendor: ['babel-polyfill', 'lodash', 'moment'] // 将不会改变的库单独生成一个bundle，更好的利用浏览器缓存
    },
    output: {
        path: path.resolve(__dirname, 'dist'), //output 目录对应一个绝对路径。
        filename: '[name].[chunkhash].js', // 开发环境使用[name].js，生产环境使用chunkhash(根据文件内容生成哈希值),使用chunkhash需要关闭HMR
        publicPath: '/' //此选项的值都会以/结束。 加载静态资源的路径,测试服务器环境就是'/'（服务器根目录）,生产环境可以设置为cdn地址，请求静态资源js和css的路径，例如：publicPath: 'http://www.a.com/',页面会插入'http://www.a.com/vendor.js'
            // library和libraryTarget没看
    },
    resolve: {
        modules: [path.resolve(__dirname, 'lib'), 'node_modules'],
        extensions: ['.js'],
        alias: {
            'demo-alias$': 'demo-alias'
        }
    },
    // watch: true, //Watch 模式默认关闭。webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
    // watchOptions: {
    //     ignored: /node_modules/,
    //     aggregateTimeout: 300,
    //     poll: 1000
    // },
    devServer: { // 使用webpack-dev-server请确保您有一个index.html指向您的捆绑包的文件，实际上并没有真正生成文件
        //hot: true, // 生产环境不需要开启hot模式，对于ExtractTextPlugin分离的css不支持，官方建议开发环境下关闭ExtractTextPlugin
        contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'asset')], //服务器提供的文件内容路径/服务的文件路径(我认为是服务器跟路径，会把多个路径的内容合并形成一个跟路径),推荐使用绝对路径,不设置此选项应该默认为应该path.output
        publicPath: '/', // necessary for HMR to know where to load the hot update chunks 确保 publicPath 总是以斜杠(/)开头和结尾
        compress: true, // 是否开启服务器压缩
        port: 9000, // 端口号
        // open: true,
        // historyApiFallback: true, //???不知道怎么使用  任意的 404 响应可以提供为 index.html 页面
        // historyApiFallback: { // 重写
        //     rewrites: [{
        //         from: /^\/haha/,
        //         to: 'index.html'
        //     }]
        // },
        // proxy: { // 设置代理
        //   '/api': 'http://localhost:3000'
        // }
        headers: { // 设置response headers，这样设置从服务端禁用了缓存
            'X-Custom-Foo': 'bar',
            'Expries': '-1',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Cache-Control': 'must-revalidate',
            'Cache-Control': 'no-store'
        }
    },
    module: {
        noParse: /moment|lodash/, // 防止 webpack 解析那些任何与给定正则表达式相匹配的文件。忽略的文件不应该被 import, require, define 或者任何其他导入机制调用。忽略大型库文件(library)可以提高构建性能。
        rules: [{
                test: /\.css$/,
                use: ExtractTextPlugin.extract({ // 开发环境建议关闭
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader', // 自身就支持HMR
            //         'css-loader'
            //     ]
            // },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }, {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }, {
                test: /\.html$/, //每个本地的 <img src="image.png"> 都需要通过 require （require('./image.png')）来进行加载
                use: [
                    'html-loader'
                ]
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            }
        ]
    },
    externals: { //externals使用场景是外部依赖不需要打包进bundle  webpack 中的 externals 配置提供了「不从 bundle 中引用依赖」的方式 http://www.css88.com/doc/webpack2/configuration/externals/
        'jquery': 'window.jQuery' //表示我们的模块中的require('jquery')中的jquery来自于window.jQuery，也就是来自于全局对象jQuery，而不要单独打包到我们的入口文件的bundle中，在页面中我们通过script标签来引入(通过外链下载的，cdn等)！
            // 'Zepto': 'window.Zepto',
            // '$': 'window.Zepto',
            // 'JavascriptInterface': 'window.JavascriptInterface'
    }, // ？？？？？？还没看
    devtool: 'cheap-eval-source-map', //source-map增大了bundle的体积 当 JavaScript 异常抛出时，你会想知道这个错误发生在哪个文件的哪一行。然而因为 webpack 将文件输出为一个或多个 bundle，所以追踪这一错误会很不方便。Source maps 试图解决这一问题 http://www.css88.com/doc/webpack2/guides/development/
    plugins: [
        //new HtmlWebpackPlugin(), // 自动生成index.html
        new HtmlWebpackPlugin({ // 自动生成html文件并插入引入的js和css
            filename: 'index.html', // 自定义文件名
            template: './src/template.html', // 以这个html为模版插入js和css
            favicon: './favicon.ico' // 添加favicon图标
        }),
        // new ExtractTextPlugin('[name].[chunkhash].css'), // 分离css,自定义文件名，可以有多个，官方建议开发环境下关闭 ExtractTextPlugin
        new ExtractTextPlugin('[name].[contenthash].css'), //contenthash：http://www.cnblogs.com/ihardcoder/p/5623411.html
        // new webpack.HotModuleReplacementPlugin(), // enabling HMR开启全局的模块热替换 使用热更新不能使用chunkhash
        new webpack.NamedModulesPlugin(), // 这个插件的作用是在控制台显示出HMR更改的文件路径，方便查看
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        }), //这里的options取不到，不知道为什么，还是需要自定义？{sourceMap: options.devtool && (options.devtool.indexOf('sourcemap') >= 0 || options.devtool.indexOf('source-map') >= 0)}
        new webpack.DefinePlugin(EVN), // 定义全局常量
        new webpack.optimize.CommonsChunkPlugin({
            // name: 'lodash', // 指定公共 bundle 的名字。从不同的 bundle 中提取所有的公共模块，并且将他们加入公共 bundle 中。如果公共 bundle 不存在，那么它将会创建一个出来。
            names: ['vendor', 'mainfest'], //// 自动加载到html中的顺序是按照这个相反的方向顺序，将运行时代码提取到一个单独的 manifest 文件中(运行时代码会被移动到最后一个公共入口) http://www.css88.com/doc/webpack2/guides/code-splitting-libraries/
            // minChunks: function(module) {
            //     // 只接受 vendor 库,该配置假定你引入的 vendor 存在于 node_modules 目录中
            //     return module.context && module.context.indexOf('node_modules') !== -1;
            // }
            //minChunks: Infinity,
        }),
        new ManifestPlugin(), // 在output目录下生成manifest.json（一些有关构建的信息）： https://www.npmjs.com/package/webpack-manifest-plugin
        new WebpackMd5Hash(), //webpack 1 中chunkhash计算规则有问题，所有需要使用这个插件，webpack 2 已经修复了
        // new webpack.NoEmitOnErrorsPlugin(), //？？？不显示错误插件,生产环境使用，不知道怎么用
        // new webpack.optimize.DedupePlugin(), //查找相等或近似的模块，避免在最终生成的文件中出现重复的模块，webpack2中已经被删除，不能使用
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery',
        //     _hz219_: 'jquery'
        // }), //当模块使用这些变量的时候,wepback会自动加载,这个可以使jquery变成全局变量(_hz219_这时也是全局变量了，代表的就是jquery)，不用在自己文件require('jquery')了，jquery会一起打包到使用的文件中,文件体积变大,我认为如果只是这个文件单独使用，就这样写，如果是公用的库就一起打包到vendor中，更好的利用缓存
    ]
};

// 没弄明白
// var ManifestPlugin = require('webpack-manifest-plugin');
// var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
// var WebpackChunkHash = require('webpack-chunk-hash');

// var InlineManifestWebpackPlugin = require('chunk-manifest-webpack-plugin');
// new webpack.HashedModuleIdsPlugin(),
// new WebpackChunkHash(), // 推荐用于生产模式 :http://www.css88.com/doc/webpack2/guides/caching/
// new ChunkManifestPlugin({
//     filename: 'chunk-manifest.json',
//     manifestVariable: 'webpackManifest'
// }),
// new InlineManifestWebpackPlugin({
//     name: 'webpackManifest'
// })
