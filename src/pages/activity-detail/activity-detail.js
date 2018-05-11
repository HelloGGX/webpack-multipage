import './activity-detail.less'
import '../../components/banner/banner.less'
import $ from 'jquery'
import BScroll from 'better-scroll'

let all = (function () {
  let imgScroll = {
    imgHeight: document.getElementsByClassName('v5-banner')[0].clientHeight,
    currentIndex: 0,
    len: $('.flagIndex').length,
    arr: [],
    scrol: new BScroll('.act-list', {
      probeType: 3,
      click: true
    }),
    init () {
      document.getElementsByClassName('act-list')[0].style.top = this.imgHeight + 'px'
      $('.go-top').on('click', (e) => {
        this.toTop()
      })
      $('.header-nav li').on('click', (e) => {
        this.navSwitch(e)
      })
      this.scrolling()
    },
    navSwitch (e) {
      var anchorIndex = $(e.currentTarget).data('index')
      $(e.currentTarget).addClass('active').siblings().removeClass('active')
      this.scrol.scrollToElement(document.getElementsByClassName('flagIndex')[anchorIndex], 100, false, 240)
    },
    toTop () {
      this.scrol.scrollToElement(document.getElementsByClassName('act-list')[0], 100, false, 0)
    },
    moveScroll (newY) { // 页面滑动弹出
      let banner = $('.banner-container')
      var f = $('.go-top')
      if (!isNaN(newY)) {
        (-newY < 340) ? f.addClass('top-button-hide').removeClass('top-button-show') : f.removeClass('top-button-hide').addClass('top-button-show');
        (-newY < 340) ? banner.addClass('banner-fade').find('.banner-tit').hide() : banner.removeClass('banner-fade').find('.banner-tit').show()
      }
    },
    scrolling () {
      this.scrol.on('scroll', (pos) => {
        var newY = pos.y

        for (var i = 0; i < this.len; i++) {
          if (-newY >= this.arr[i]) {
            $($('.header-nav li')[i]).addClass('active').siblings().removeClass('active')
          }
        }

        this.moveScroll(newY)// 显示回到顶部按钮
        $('.bg-layer').css({'transform': 'translate3d(0,' + newY + 'px,0)'})
        var percent = Math.abs(newY / this.imgHeight)// 拖动图片变大的算法
        var zIndex = 0
        var scale = 1
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        }
        $('.v5-banner').css({'z-index': zIndex, 'transform': 'scale(' + scale + ')'})
      })
    }

  }
  let home = {
    pageInit: function () {
      imgScroll.init()
    }
  }
  return home
}())

$(function () {
  all.pageInit()
})
