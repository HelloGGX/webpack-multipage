const pages = [ // 页面配置写在这里
  {
    title: '登陆',
    pageName: 'login'
  },
  {
    title: '短信登陆',
    pageName: 'login-msg'
  },
  {
    title: '注册',
    pageName: 'regist'
  },
  {
    title: '山度CLUB',
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
    title: '活动相册',
    pageName: 'act-album'
  },
  {
    title: '俱乐部社区',
    pageName: 'club'
  },
  {
    title: '俱乐部详情',
    pageName: 'club-detail'
  },
  {
    title: '创建俱乐部',
    pageName: 'club-create'
  },
  {
    title: '个人中心',
    pageName: 'person'
  },
  {
    title: '我的档案',
    pageName: 'per-data'
  },
  {
    title: '资料编辑',
    pageName: 'per-data-edit'
  },
  {
    title: '我的订单',
    pageName: 'orders'
  },
  {
    title: '身份认证',
    pageName: 'identity'
  },
  {
    title: '提现',
    pageName: 'cash'
  },
  {
    title: '设置收款账户',
    pageName: 'bank'
  },
  {
    title: '退款审核',
    pageName: 'refund'
  },
  {
    title: '报名管理',
    pageName: 'act-apply-mag'
  },
  {
    title: '我的俱乐部',
    pageName: 'club-my'
  },
  {
    title: '发布游记',
    pageName: 'travel-release'
  },
  {
    title: '游记列表',
    pageName: 'travel-list'
  },
  {
    title: '游记详情',
    pageName: 'travel-detail'
  },
  {
    title: '活动收款',
    pageName: 'act-receipt'
  },
  {
    title: '俱乐部管理',
    pageName: 'club-mag'
  },
  {
    title: '会员管理',
    pageName: 'member-mag'
  },
  {
    title: '签到',
    pageName: 'sign-in'
  },
  {
    title: '会员充值',
    pageName: 'recharge'
  },
  {
    title: '我的花絮',
    pageName: 'my-album'
  },
  {
    title: '添加花絮照片',
    pageName: 'my-album-create'
  },
  {
    title: '山度头条',
    pageName: 'notice'
  },
  {
    title: '找回密码',
    pageName: 'get-pwd'
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
