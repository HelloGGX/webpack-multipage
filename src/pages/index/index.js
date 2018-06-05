import './index.less'
import BScroll from 'better-scroll'
import $ from 'jquery'
import weui from 'weui.js'
import {judgeLogin} from 'components/judgeLogin/judge-login'

let all = (function () {
  const DIRECTION_H = 'horizontal'
  const DIRECTION_V = 'vertical'

  let allData = {
    init () {
      this._getIndexData()
    },
    _getIndexData () {
      judgeLogin((res) => { // 判断是否登陆
        scrollNav.init(res.navdata)// 顶部导航栏初始化
        slider.init(res.slidata)// 幻灯片初始化
        hotArea.init(res.areadata)// 热门区域初始化
      }, () => {}, () => {
        weui.alert('建议登陆体验哦~')
      })
    }
  }// 获取所有数据
  let scrollNav = {// 顶部导航对象
    probeType: 1,
    click: true,
    direction: 'horizontal',
    startY: 0,
    startX: 0,
    init (data) {
      this._getNavData(data)
      this.initScroll()
    },
    initScroll () {
      let options = {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.freeScroll || this.direction === DIRECTION_V,
        scrollX: this.freeScroll || this.direction === DIRECTION_H,
        startX: this.startX,
        startY: this.startY
      }
      this.scroll = new BScroll('.list-wrapper', options)
    },
    _initNavWidth () {
      let len = $('#navbar-ul').find('li').length
      let liWidth = $('#navbar-ul').find('li').width() + 20
      let allWidth = liWidth * len + 'px'
      $('#navbar-ul').width(allWidth)
    },
    _selectNav (thi) {
      this.current = $(thi).data('index')
      this._adjust($(thi).data('index'))
    },
    _adjust (tabId) {
      const viewportWidth = document.getElementsByClassName('viewport')[0].clientWidth
      const tabListWidth = document.getElementById('navbar-ul').clientWidth
      const minTranslate = Math.min(0, viewportWidth - tabListWidth)
      const middleTranslate = viewportWidth / 2
      const items = document.getElementById('navbar-ul').children
      let width = 0
      this.navdata.every((item, index) => {
        if (item.id === tabId) {
          return false
        }
        width += items[index].clientWidth + 25
        return true
      })
      let translate = middleTranslate - width
      translate = Math.max(minTranslate, Math.min(0, translate))
      $('.scroll-content').css({
        'transform': 'translate(' + translate + 'px' + ', 0px)',
        'transition-duration': '300ms'
      })
      // this.scroll && this.scroll.scrollTo(translate, 0, 300)
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    _getNavData (data) {
      let thi = this
      // Promise的方法then,catch方法
      thi.navdata = data
      let _html = ''
      let len = thi.navdata.length
      for (let i = 0; i < len; i++) {
        _html += '<li class="nav-bar-item" data-index=' + thi.navdata[i].id + '><span>' + thi.navdata[i].text + '</span></li>'
      }
      $('#navbar-ul').html(_html)
      $('#navbar-ul li').eq(0).find('span').addClass('nbi-selected')
      thi._initNavWidth()
      $('body').on('click', '.nav-bar-item', function (e) {
        thi._selectNav(this)
        $(this).find('span').addClass('nbi-selected').parent().siblings().find('span').removeClass('nbi-selected')
      })
    }
  }
  let slider = {// 幻灯片对象
    loop: true,
    autoPlay: true,
    interval: 400,
    click: true,
    threshold: 0.3,
    speed: 400,
    currentPageIndex: 0,
    _initSliderWidth () {
      this.children = $('.slider-group').children()
      let width = 0
      let sliderWidth = $('.slider').width()
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        $(child).addClass('slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop) {
        width += 2 * sliderWidth
      }
      $('.slider-group').css('width', width + 'px')
    },
    _initSlider () {
      let options = {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: this.threshold,
          speed: this.speed
        },
        bounce: false,
        click: this.click
      }
      this.slide = new BScroll('.slider', options)
      this.slide.on('scrollEnd', () => {
        let pageIndex = this.slide.getCurrentPage().pageX
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          this._play()
        }
      })

      this.slide.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    init (data) {
      this._getSlideData(data)
      $('.weui-flex__item').on('click', (e) => {
        if ($(e.currentTarget).data('index') === 0) {
          if (window.sessionStorage.getItem('ucl') === '用户') {
            weui.alert('抱歉你是普通用户，不能创建活动')
          } else {
            window.location.href = 'act-create.html'
          }
        }
      })
    },
    _getSlideData (data) {
      let thi = this

      thi.slidata = data
      let _html = ''
      let _dots = ''
      let len = thi.slidata.length
      for (let i = 0; i < len; i++) {
        _html += '<div data-index=' + thi.slidata[i].id + '><a class="" href=' + thi.slidata[i].href + '><img src=' + thi.slidata[i].src + ' alt=""></a></div>'
        _dots += '<span class="dot"></span>'
      }
      $('.slider-group').html(_html)
      $('.dots').html(_dots)
      $('.dots .dot:first').addClass('active')
      thi._initSliderWidth()
      thi._initSlider()
    },
    _play () {
      let pageIndex = this.currentPageIndex + 1
      let dot = $('.dots').children()
      if (this.loop) {
        pageIndex += 1
      }
      // console.log(this.currentPageIndex+1)
      $(dot[this.currentPageIndex + 1]).addClass('active').siblings().removeClass('active')
      this.timer = setTimeout(() => {
        this.slide.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  }
  let hotArea = {// 热门区域对象
    init (data) {
      this._getAreaData(data)
    },
    _getAreaData (data) {
      let thi = this
      if (data !== null) {
        thi.areadata = data
        let _html = ''
        let len = thi.areadata.length
        for (let i = 0; i < len; i++) {
          _html += `<div class="store-item" data-id=${thi.areadata[i].id}>
                      <a href="act-detail.html?id=${thi.areadata[i].id}">
                      <div class="store-content">
                          <div class="goods-image">
                              <div class="image-container" style="background-image:url(${thi.areadata[i].imgsrc})">
                                  
                              </div>
                          </div>
                          <div class="goods-detail">
                              <p class="goods-name">${thi.areadata[i].name}</p>
                              <div class="goods-content">
                                  <p class="goods-sales">距离${thi.areadata[i].distance}米</p>
                              </div>
                              <del class="goods-market-price">${thi.areadata[i].marprice}</del>
                              <div class="discount-price"><i>￥</i>${thi.areadata[i].disprice}</div>
                              <div class="goods-buy">立即报名</div>
                          </div>
                      </div>
                      </a>
                  </div>`
        }
        $('.stores').html(_html)
      } else {
        $('#otherPage').html(`<div class="nothing-text" style="position: relative;">
       
        <p>暂时还没有新活动</p>
    </div>`)
      }
    }
  }
  let Home = {
    pageInit: function () {
      allData.init()// 获取该页所有json数据并展示
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
