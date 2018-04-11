const webpack = require('webpack')
const CleanWebpack = require('clean-webpack-plugin')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
    //const HtmlInlinkChunkPlugin = require('html-webpack-inline-chunk-plugin')
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: require('../src/dll/libs-manifest.json'),
            name: 'libs'
        }),
        new AddAssetHtmlPlugin({
            filepath: resolve('src/dll/libs.dll.js'),
            includeSourcemap: false,
            publicPath: './js/libs/',
            outputPath: './js/libs'
        }),
        new BundleAnalyzerPlugin(), //打包分析
        new webpack.optimize.CommonsChunkPlugin({
            names: ['manifest', 'libs'].reverse(), //因为用了DllReferencePlugin来优化打包速度所以这里分离出的libs是libs.dll.js的类似sourcemap的索引
            filename: 'js/libs/[name].[hash:5].js',
            minChunks: Infinity
        }),
        // new HtmlInlinkChunkPlugin({//把该页的js追加到html页面
        //     inlineChunks:['manifest']
        // }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: false,
            parallel: true,
            cache: true
        }),
        new CleanWebpack(['dist'], {
            root: path.resolve(__dirname, '../'), //根目录
            verbose: true, //开启在控制台输出信息
            dry: false //启用删除文件
        })
    ]
}