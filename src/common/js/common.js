import 'common/css/reset.less'
import 'common/css/base.less'
import 'common/css/iconfont.css'
import 'weui'
import BScroll from 'better-scroll'
import $ from 'jquery'
let tabar = {// 底部工具栏
  init () {
    let sId = window.location.hash
    console.log(sId)
    $('.footer a').on('click', (e) => {
      $(e.currentTarget).addClass('tabbar_on').siblings().removeClass('tabbar_on')
    })
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
  scroll.init()
  tabar.init()
})
