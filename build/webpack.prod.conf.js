const webpack = require('webpack')
const CleanWebpack = require('clean-webpack-plugin')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports={
    plugins:[ 
        new webpack.DllReferencePlugin({
            manifest:require('../src/dll/dependencies-manifest.json'),
            name: 'dependencies'
        }),

        new BundleAnalyzerPlugin(),//打包分析
        new webpack.optimize.CommonsChunkPlugin({
            names: ['dependencies','manifest'],//manifest是webpack生成的代码
            filename: 'js/vendor/[name].[chunkhash:5].js',
            minChunks: Infinity
        }),
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
            root: path.resolve(__dirname, '../'),       　　　　　　　　　　//根目录
            verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
            dry:      false        　　　　　　　　　　//启用删除文件
        })
    ]
}