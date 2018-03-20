const productionConfig = require('./webpack.prod.conf')//生产环境配置
const developmentConfig = require('./webpack.dev.conf')//开发环境配置
const ExtractTextWebpack = require('extract-text-webpack-plugin')//提取css
const globalConfig = require('./global.conf')
const pagesConfig =require('./pages.conf')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

const extractCss =  new ExtractTextWebpack({
    filename: 'css/[name]-bundle-[hash:5].css',
    //allChunks: false//指定提取css的范围
})

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const generateConfig = env => {

    const scriptLoader = ['babel-loader']
    const cssLoaders = [
        {
            loader: 'css-loader',
            options: {
                camelCase: true,
                minimize: true,
                sourceMap: env === 'development'
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                sourceMap: env === 'development',
                plugins: [
                    // 自动加浏览器前缀
                    require('autoprefixer')()
                ]
            }
        }
    ]
    const styleLoader = env ==='production'
        ? extractCss.extract({
            fallback: {
                loader: 'style-loader',
                    options: {
                        sourceMap: env === 'development'
                    }
            },
            use:cssLoaders
        })
        :[{
            loader:'style-loader'
        }].concat(cssLoaders)

    const fileLoader = outputPath => {
        return env === 'development'
            ? [{
                loader: 'file-loader',
                options: {
                    name: '[name]-[hash:5].[ext]',
                    // publicPath:'../',
                    outputPath: outputPath
                }
            }]
            : [{
                loader: 'url-loader',//带图片转base64功能
                options: {
                    name: '[name]-[hash:5].[ext]',
                    limit: 1000,//1000=1kb
                    // publicPath:'',
                    outputPath: outputPath,
                    // useRelativePath:true
                }
            }]
    }
    return{
        context: path.resolve(__dirname, '../'),
        entry: {
            dependencies: globalConfig.dependencies,
            common:resolve('src/common/js/common.js')
        },
        resolve: {
            extensions: ['.js', '.json'],
            alias: {
                '@': resolve('src'),
                'common':resolve('src/common'),
                'components':resolve('src/components')
            }
        },
        output: {
            path: resolve('dist'),
            publicPath: '',
            filename: 'js/[name].[hash:5].js',
            chunkFilename: '[name].bundle.js'
        },
        module:{
            rules:[
                {//处理js
                    test: /\.js$/,
                    include: [resolve('src/common/js'),resolve('src/components/'),resolve('src/pages/**/')],
                    exclude: [resolve('vendor')],
                    use:scriptLoader
                },
                 {//处理css
                    test: /\.css$/,
                    use: styleLoader
                },
                {//图片的转换和压缩
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: fileLoader('img/').concat(
                        env === 'production'
                        ?{
                            loader: 'img-loader',//压缩图片
                            options: {
                                pngquant: {
                                    quality: 80
                                }
                            }
                        }
                        :[]
                    )
                },
                {//处理字体文件
                    test:/\.(eot|woff2?|ttf|svg)$/,
                    use: fileLoader
                }
            ]
        },
        plugins:[
            new webpack.ProvidePlugin({
                $: 'jquery',
                weui:'weui.js'
            }),
        ]
    }
}


module.exports = env => {

    const baseConfig = merge([generateConfig(env)].concat(pagesConfig))
    let runConfig = env === 'production'
    ? productionConfig
    : developmentConfig
    
    console.log(merge(baseConfig, runConfig))
    return merge(baseConfig, runConfig)
}