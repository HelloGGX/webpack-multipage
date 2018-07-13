import './index.less'
import 'components/banner/banner.less'
import BScroll from 'better-scroll'
import $ from 'jquery'
import weui from 'weui.js'
import {imgSuffix} from 'common/js/dom'
import {judgeLogin} from 'components/judgeLogin/judge-login'
import {bubb} from 'vendor/bubble'
import map from 'components/map/map'
import model from 'api/getIndex'

let all = (function () {
  // const DIRECTION_H = 'horizontal'
  // const DIRECTION_V = 'vertical'
  let PAGE = 1
  let allData = {
    init () {
      this._getIndexData()
      bubb.init(() => {
        var loading = weui.loading('loading')
        setTimeout(() => {
          loading.hide(() => {
            bubb.update()
            window.location.reload()
          })
        }, 800)
      }, () => {
        var loading = weui.loading('loading')
        setTimeout(() => {
          loading.hide(() => {
            bubb.update()
            PAGE += 6
            this.getData(PAGE)
          })
        }, 800)
      })
    },
    getMap () {
      map.then(data => {
        model.postAddr({addr: data.district}).then(res => {
        }).catch(errMsg => {
          weui.alert(errMsg)
        })
        let addComp = data
        let cityName = document.getElementsByClassName('city')[0]
        let province = document.getElementsByClassName('province')[0]
        let adcode = document.getElementsByClassName('adcode')[0]
        let fulladdr = document.getElementsByClassName('fulladdr')[0]
        let city = document.getElementById('city')
        var fullName = addComp.province + ', ' + addComp.city + ', ' + addComp.district + ', ' + addComp.street + ', ' + addComp.streetNumber
        city.innerHTML = addComp.district
        province.setAttribute('value', addComp.province)
        cityName.setAttribute('value', addComp.city)
        adcode.setAttribute('value', addComp.district)
        fulladdr.setAttribute('value', fullName)
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    getData (page) {
      model.getIndexData({page: page}).then(data => {
        // scrollNav.init(res.navdata)// 顶部导航栏初始化
        slider.init(data.slidata)// 幻灯片初始化
        hotArea.init(data.areadata, data.load)// 热门区域初始化
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    _getIndexData () {
      this.getMap()
      this.getData()
      judgeLogin(() => { // 登陆时候
        $('.weui-flex__item').on('click', (e) => {
          if (Number($(e.currentTarget).data('index')) === 3) {
            if (window.sessionStorage.getItem('ucl') === '用户') {
              weui.alert('抱歉你是普通用户，不能创建活动')
            } else {
              window.location.href = 'act-create.html'
            }
          }
          if (Number($(e.currentTarget).data('index')) === 0) {
            window.location.href = 'sign-in.html'
          }
          if (Number($(e.currentTarget).data('index')) === 4) {
            window.location.href = 'act-mag.html'
          }
          if (Number($(e.currentTarget).data('index')) === 6) {
            window.location.href = 'club-create.html'
          }
          if (Number($(e.currentTarget).data('index')) === 7) {
            window.location.href = 'recharge.html'
          }
        })
      }, () => { // 未登陆时候
        $('.weui-flex__item').on('click', (e) => {
          if ($(e.currentTarget).data('index') !== 5 && $(e.currentTarget).data('index') !== 2) {
            weui.confirm('建议登陆体验哦~', {
              title: '提示',
              buttons: [{
                label: '先逛逛看',
                type: 'default',
                onClick: function () { console.log('no') }
              }, {
                label: '马上登陆',
                type: 'primary',
                onClick: function () { window.location.href = 'login.html' }
              }]
            })
          }
        })
        weui.confirm('建议登陆体验哦~', {
          title: '提示',
          buttons: [{
            label: '先逛逛看',
            type: 'default',
            onClick: function () { console.log('no') }
          }, {
            label: '马上登陆',
            type: 'primary',
            onClick: function () { window.location.href = 'login.html' }
          }]
        })
      })
    }
  }// 获取所有数据
  // let scrollNav = {// 顶部导航对象
  //   probeType: 1,
  //   click: true,
  //   direction: 'horizontal',
  //   startY: 0,
  //   startX: 0,
  //   init (data) {
  //     this._getNavData(data)
  //     this.initScroll()
  //   },
  //   initScroll () {
  //     let options = {
  //       probeType: this.probeType,
  //       click: this.click,
  //       scrollY: this.freeScroll || this.direction === DIRECTION_V,
  //       scrollX: this.freeScroll || this.direction === DIRECTION_H,
  //       startX: this.startX,
  //       startY: this.startY
  //     }
  //     this.scroll = new BScroll('.list-wrapper', options)
  //   },
  //   _initNavWidth () {
  //     let len = $('#navbar-ul').find('li').length
  //     let liWidth = $('#navbar-ul').find('li').width() + 20
  //     let allWidth = liWidth * len + 'px'
  //     $('#navbar-ul').width(allWidth)
  //   },
  //   _selectNav (thi) {
  //     this.current = $(thi).data('index')
  //     this._adjust($(thi).data('index'))
  //   },
  //   _adjust (tabId) {
  //     const viewportWidth = document.getElementsByClassName('viewport')[0].clientWidth
  //     const tabListWidth = document.getElementById('navbar-ul').clientWidth
  //     const minTranslate = Math.min(0, viewportWidth - tabListWidth)
  //     const middleTranslate = viewportWidth / 2
  //     const items = document.getElementById('navbar-ul').children
  //     let width = 0
  //     this.navdata.every((item, index) => {
  //       if (item.id === tabId) {
  //         return false
  //       }
  //       width += items[index].clientWidth + 25
  //       return true
  //     })
  //     let translate = middleTranslate - width
  //     translate = Math.max(minTranslate, Math.min(0, translate))
  //     $('.scroll-content').css({
  //       'transform': 'translate(' + translate + 'px' + ', 0px)',
  //       'transition-duration': '300ms'
  //     })
  //     // this.scroll && this.scroll.scrollTo(translate, 0, 300)
  //   },
  //   refresh () {
  //     this.scroll && this.scroll.refresh()
  //   },
  //   _getNavData (data) {
  //     let thi = this
  //     // Promise的方法then,catch方法
  //     thi.navdata = data
  //     let _html = ''
  //     let len = thi.navdata.length
  //     for (let i = 0; i < len; i++) {
  //       _html += '<li class="nav-bar-item" data-index=' + thi.navdata[i].id + '><span>' + thi.navdata[i].text + '</span></li>'
  //     }
  //     $('#navbar-ul').html(_html)
  //     $('#navbar-ul li').eq(0).find('span').addClass('nbi-selected')
  //     thi._initNavWidth()
  //     $('body').on('click', '.nav-bar-item', function (e) {
  //       thi._selectNav(this)
  //       $(this).find('span').addClass('nbi-selected').parent().siblings().find('span').removeClass('nbi-selected')
  //     })
  //   }
  // }
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
    },
    _getSlideData (data) {
      let thi = this

      thi.slidata = data
      if (typeof thi.slidata !== 'undefined') {
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
      }
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
    init (data, load) {
      this._getAreaData(data, load)
    },
    _temple (i, data) {
      return `<div class="store-item" data-id=${data[i].id}>
      <a href="act-detail.html?id=${data[i].id}">
        <div class="store-content">
          <div class="goods-image">
              <div class="image-container" style="background-image:url(${imgSuffix(data[i].imgsrc, 2)})">
                            
              </div>
          </div>
          <div class="goods-detail">
            <p class="goods-name">${data[i].name}</p>
              <div class="goods-content">
                  <p class="goods-sales">${data[i].time}</p>
                  <p class="goods-sales">活动积分${data[i].integral} <span>活动等级${data[i].level}</span></p>
              </div>
              <del class="goods-market-price">${data[i].marprice}</del>
              <div class="discount-price"><i>￥</i>${data[i].disprice}</div>
              <div class="goods-buy">立即报名</div>
            </div>
        </div>
      </a>
    </div>`
    },
    _getAreaData (data, load) {
      if (load) { // 如果不是初始化，是下拉刷新
        let len = data.length
        if (len !== 0) { // 如果下拉刷新有值
          for (let i = 0; i < len; i++) {
            $('.stores').append(this._temple(i, data))
          }
        }
      } else { // 如果是初始化
        if (data.length !== 0) { // 如果初始化有数据
          let len = data.length
          for (let i = 0; i < len; i++) {
            $('.stores').append(this._temple(i, data))
          }
        }
      }
    //   else {
    //     $('#otherPage').html(`<div class="nothing-text" style="position: relative;">
    //     <p>暂时还没有新活动</p>
    // </div>`)
    //   }
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
