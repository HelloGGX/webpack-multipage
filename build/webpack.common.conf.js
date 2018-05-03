const productionConfig = require('./webpack.prod.conf') // 生产环境配置
const developmentConfig = require('./webpack.dev.conf') // 开发环境配置
const ExtractTextWebpack = require('extract-text-webpack-plugin') // 提取css
const globalConfig = require('./global.conf')
const pagesConfig = require('./pages.conf')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

const extractCss = new ExtractTextWebpack({
  filename: 'css/[name]-bundle-[chunkHash:5].css',
  allChunks: false// 指定提取css的范围
})

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const generateConfig = env => {
  const scriptLoader = ['babel-loader']
  const cssLoaders = [{
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
  },
  {
    loader: 'less-loader',
    options: {
      sourceMap: env === 'development'
    }
  }
  ]
  const styleLoader = env === 'production'
    ? extractCss.extract({
      fallback: {
        loader: 'style-loader',
        options: {
          sourceMap: env === 'development'
        }
      },
      use: cssLoaders
    }) : [{
      loader: 'style-loader'
    }].concat(cssLoaders)

  const fileLoader = path => {
    return env === 'development' ? [{
      loader: 'file-loader',
      options: {
        name: '[name]-[hash:5].[ext]',
        publicPath: '',
        outputPath: path
      }
    }] : [{
      loader: 'url-loader', // 带图片转base64功能
      options: {
        name: '[name]-[hash:5].[ext]',
        limit: 1600, // 1600=16kb
        outputPath: path,
        publicPath: '/imgs'
      }
    }]
  }

  return {
    mode: env,
    target: 'web',
    context: path.resolve(__dirname, '../'),
    entry: {
      libs: globalConfig.dependencies,
      common: resolve('src/common/js/common.js')
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': resolve('src'),
        'common': resolve('src/common'),
        'components': resolve('src/components'),
        'api': resolve('src/api'),
        'assets': resolve('src/assets')
      }
    },
    output: {
      path: resolve('dist'),
      filename: 'js/[name].[hash:5].js',
      chunkFilename: 'js/[name].[chunkhash:5].js',
      publicPath: env === 'production'
        ? '/' : ''
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'eslint-loader',
          exclude: '/node_modules/',
          enforce: 'pre'
        },
        { // 处理js
          test: /\.js$/,
          include: [resolve('src/common/js'), resolve('src/components/'), resolve('src/pages/'), resolve('src/api/')],
          exclude: [resolve('src/vendor'), resolve('src/dll'), '/node_modules/'],
          use: scriptLoader
        },
        { // 处理less
          test: /\.less$/,
          use: styleLoader
        },
        { // 处理css
          test: /\.css$/,
          use: styleLoader
        },
        { // 图片的转换和压缩
          test: /\.(png|jpg|jpeg|gif)$/,
          use: fileLoader('imgs/').concat(
            env === 'production' ? {
              loader: 'img-loader', // 压缩图片
              options: {
                pngquant: {
                  quality: 80
                }
              }
            } : []
          )
        },
        { // 处理字体文件
          test: /\.(eot|woff2?|ttf|svg)$/,
          use: fileLoader('fonts/')
        }

      ]
    },
    plugins: [
      extractCss,
      new webpack.ProvidePlugin({
        $: 'jquery',
        weui: 'weui.js',
        BScroll: 'better-scroll',
        axios: 'axios'
      })
    ]
  }
}

module.exports = env => {
  const baseConfig = merge([generateConfig(env)].concat(pagesConfig))
  let runConfig = env === 'production'
    ? productionConfig
    : developmentConfig

  return merge(baseConfig, runConfig)
}
