const webpack = require('webpack')
const CleanWebpack = require('clean-webpack-plugin')
const path = require('path')

module.exports={
    plugins:[ 
        
        new webpack.optimize.CommonsChunkPlugin({
            names: ['dependencies','manifest'],//manifest是webpack生成的代码
            filename: 'js/vendor/[name].[hash:5].js',
            minChunks: Infinity
        }),
        new webpack.optimize.UglifyJsPlugin(),//js压缩
        new CleanWebpack(['dist'], {
            root: path.resolve(__dirname, '../'),       　　　　　　　　　　//根目录
            verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
            dry:      false        　　　　　　　　　　//启用删除文件
        })
    ]
}