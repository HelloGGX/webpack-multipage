const pages = [ // 页面配置写在这里
  {
    title: '登陆',
    pageName: 'login'
  },
  {
    title: '注册',
    pageName: 'regist'
  },
  {
    title: '首页',
    pageName: 'index'
  },
  {
    title: '活动',
    pageName: 'act'
  },
  {
    title: '活动详情',
    pageName: 'act-detail'
  },
  {
    title: '活动报名',
    pageName: 'act-apply'
  },
  {
    title: '支付报名费用',
    pageName: 'act-pay'
  },
  {
    title: '组织活动',
    pageName: 'act-create'
  },
  {
    title: '活动管理列表',
    pageName: 'act-mag'
  },
  {
    title: '活动信息管理',
    pageName: 'act-info-mag'
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
