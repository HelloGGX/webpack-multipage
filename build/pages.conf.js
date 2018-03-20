const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlinkChunkPlugin = require('html-webpack-inline-chunk-plugin')
const globalConfig = require('./global.conf')

const pages = globalConfig.pages

const generatePage = function({
    title = '',
    entry = '',
    template = '',
    name = '',
    commonChunks=['manifest','dependencies','common'],
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
                filename: name + '.html',
                chunksSortMode: 'manual'//应用文件顺序
            })
        ]
    }
}
const normalize = (title,pageName) =>{
    const entry = {}
    const url = './src/pages/'+ pageName +'/'+ pageName
    entry[pageName] = url
    return  {
        title:title,
        entry:entry,
        template:url+'.html',
        name:pageName,
        chunks: [pageName]
    }
}
const configPages = []
pages.map(item=>{
    configPages.push(normalize(item.title,item.pageName))
})
const config = []
configPages.map(item => {
    config.push(generatePage(item))
})

module.exports = config