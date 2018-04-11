const path = require('path')
const webpack = require('webpack')
    //第三方库不用重复打包，优化打包速度

module.exports = {
    entry: {
        libs: ['jquery', 'weui.js', 'babel-polyfill','better-scroll','axios']
    },
    output: {
        path: path.join(__dirname, '../src/dll'),
        filename: '[name].dll.js',
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '../src/dll', '[name]-manifest.json'),
            name: '[name]'
        }),

        new webpack.optimize.UglifyJsPlugin()
    ]
}