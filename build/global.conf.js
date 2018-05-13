const pages = [ // 页面配置写在这里
  {
    title: '首页',
    pageName: 'index'
  },
  {
    title: '活动',
    pageName: 'activity'
  },
  {
    title: '活动详情',
    pageName: 'activity-detail'
  },
  {
    title: '组织活动',
    pageName: 'create-act'
  },
  {
    title: '俱乐部社区',
    pageName: 'club'
  },
  {
    title: '创建俱乐部',
    pageName: 'create-club'
  },
  {
    title: '个人中心',
    pageName: 'person'
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
