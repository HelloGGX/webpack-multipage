const merge = require('webpack-merge')
const webpack = require('webpack')
const glob = require('glob-all')

const HtmlInlinkChunkPlugin = require('html-webpack-inline-chunk-plugin')
const CleanWebpack = require('clean-webpack-plugin')

const uglify = require('uglifyjs-webpack-plugin');
const path = require('path')



const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const baseConfig = {
    

    devtool: 'cheap-module-source-map', 

    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: path.posix.join('./', 'index.html') },
              ]
        },
        inline: true,
        hot: true,//启用模块热更新
        hotOnly: true,//devServer.hot在构建失败的情况下启用无需刷新页面作为回退的热模块替换
        contentBase: './',
        compress: true,//一切服务都启用gzip 压缩
        host: HOST || 'localhost',//指定使用一个 host。默认是 localhost
        port: PORT || '8080',//指定一个端口号
        open: true,
        overlay: true//当出现编译器错误或警告时，在浏览器中显示全屏叠加
          ? { warnings: false, errors: true }
          : false,
        proxy:{},
        watchOptions: {
            poll: false,
        }
    },
    module: {
        rules: [
        // {//处理html中引入的img
        //     test:/\.html$/,
        //     use:[
        //         {
        //             loader:'html-loader',
        //             options:{
        //                 minimize: true,
        //                 attrs:['img:src','img:data-src']
        //             }
        //         }
        //     ]
        // }
    ]
    },

    plugins: [
        new uglify(),
        
        new webpack.ProvidePlugin({
            $: 'jquery',
            weui:'weui.js'
        }),
        new CleanWebpack(path.resolve(__dirname, 'dist')),

        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor','manifest'],//manifest是webpack生成的代码
            filename: '[name].[hash:5].js',
            minChunks: Infinity
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
}

const generatePage = function({
    title = '',
    entry = '',
    template = './src/index.html',
    name = '',
    commonChunks=['vendor','manifest','common'],
    chunks = []
} = {}) {
    return {
        entry,
        plugins: [
            new HtmlInlinkChunkPlugin({//把该页的js追加到html页面
                inlineChunks:chunks
            }),
            new HtmlWebpackPlugin({
                chunks:chunks.concat(commonChunks),
                template,
                title,
                filename: name + '.html'
            })
        ]
    }
}

const pages = [
    generatePage({
        title: 'index',
        entry: {
            index: './src/js/page/index.js'
        },
        name: 'index',
        chunks: ['index']
    }),


    generatePage({
        title: 'page B',
        template: './src/pages/b.html',
        entry: {
            b: './src/js/page/b.js'
        },
        name: 'b',
        chunks: ['b']
    })
]
module.exports = merge([baseConfig].concat(pages))