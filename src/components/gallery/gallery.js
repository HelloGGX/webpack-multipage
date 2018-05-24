import Swiper from './swiper.min'
import $ from 'jquery'
import './swiper.min.css'
import './gallery.less'

let gallery = {
  swiperStatus: false,

  init (imgsdata, e) {
    let swiper = new Swiper('.swiper-container', {
      zoom: true,
      width: window.innerWidth,
      virtual: true,
      spaceBetween: 20,
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
      },
      on: {
        click: function () {
          $('#origin-img').fadeOut('fast')
          this.virtual.slides.length = 0
          this.virtual.cache = []
          this.swiperStatus = false
        }
      }

    })
    let clickIndex = $(e.currentTarget).index()
    imgsdata.map(key => {
      for (let i = 0; i < key['url'].length; i++) {
        swiper.virtual.appendSlide(`<div class="swiper-zoom-container"><img src=${key['url'][i]} /></div>`)
      }
    })
    swiper.slideTo(clickIndex)
    $('#origin-img').fadeIn('fast')
    this.swiperStatus = true
    // 切换图状态禁止页面缩放
    document.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1 && this.swiperStatus) {
        event.preventDefault()
      }
    })
    var lastTouchEnd = 0
    document.addEventListener('touchend', function (event) {
      var now = (new Date()).getTime()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    }, false)

    document.addEventListener('touchmove', function (e) {
      if (this.swiperStatus) {
        e.preventDefault()
      }
    })
  }

}

export {gallery}
