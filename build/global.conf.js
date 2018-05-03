const pages = [ // 页面配置写在这里
  {
    title: 'index',
    pageName: 'index'
  },
  {
    title: 'store-list',
    pageName: 'store-list'
  },
  {
    title: 'activity',
    pageName: 'activity'
  },
  {
    title: 'club',
    pageName: 'club'
  }
]
const dependencies = [ // 依赖的全局js
  'babel-polyfill',
  'jquery',
  'weui.js',
  'better-scroll',
  'axios'
]

const globalConfig = {
  'pages': pages,
  'dependencies': dependencies
}

module.exports = globalConfig
