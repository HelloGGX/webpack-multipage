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
let textArea = {// 监听textArea的输入字数
  init () {
    $('body').on('keyup', '.weui-textarea', (e) => {
      this.listenText(e.currentTarget)
    })
  },
  listenText (_this) {
    var les = $(_this).val()
    // var slogan = 200-les.length;
    var slogan = les.length
    $(_this).next('.weui-textarea-counter').find('span').text(slogan > 0 ? slogan : 0)
  }
}

let swit = {
  init () {
    $('body').on('click', '.weui-cell__ft', (e) => {
      this.change(e.currentTarget)
    })
  },
  change (classname) {
    if ($(classname).find('input').is(':checked')) {
      $(classname).find('input').val('是')
    } else {
      $(classname).find('input').val('否')
    }
  }
}
$(function () {
  title.init()
  scroll.init()
  tabar.init()
  textArea.init()
  swit.init()
})
