import 'common/css/reset.less'
import 'common/css/base.less'
import 'common/css/iconfont.css'
import 'weui'
import BScroll from 'better-scroll'
import $ from 'jquery'

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
    this.scroll = new BScroll('.content-wrapper', options)
    // console.log(this.scroll)
  }
}
$(function () {
  scroll.init()
})
