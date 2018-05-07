import 'common/css/reset.less'
import 'common/css/base.less'
import 'common/css/iconfont.css'
import 'weui'
import BScroll from 'better-scroll'
import $ from 'jquery'

let title = {// 把每页的title值赋值给banner上的标题
  init () {
    if ($('.banner-tit').length > 0) {
      $('.banner-tit').html($('title').html())
    }
  }
}
let tabar = {// 底部工具栏
  init () {
    this.active()
    $('.footer a').on('click', (e) => {
      $(e.currentTarget).addClass('tabbar_on').siblings().removeClass('tabbar_on')
    })
  },
  active () {
    let pageType = window.location.pathname.match(/^\/[a-zA-Z]*/g)
    let [, ...rest] = pageType[0]
    let result = rest.join('')
    $('#' + result) && $('#' + result).addClass('tabbar_on').siblings().removeClass('tabbar_on')
  }
}
let scroll = {
  init () {
    let options = {
      probeType: 1,
      click: true,
      scrollY: true,
      scrollX: false,
      startX: 0,
      startY: 0
    }
    if ($('.content-wrapper')) {
      this.scroll = new BScroll('.content-wrapper', options)
    }
    // console.log(this.scroll)
  }
}
$(function () {
  title.init()
  scroll.init()
  tabar.init()
})
