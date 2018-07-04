import Swiper from './swiper.min'
import $ from 'jquery'
import './swiper.min.css'
import './gallery.less'

let gallery = {
  swiperStatus: null,

  init (imgsdata) {
    let _thi = this
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
          _thi.swiperStatus = false
        }
      }

    })
    $('#album-container').on('click', '.album-photos li', (e) => {
      let clickIndex = $(e.currentTarget).index()
      let imglist = $(e.currentTarget).parent().attr('data-album')
      console.log(imgsdata)
      let imgs = imgsdata[Number(imglist)]

      for (let i = 0; i < imgs['url'].length; i++) {
        swiper.virtual.appendSlide(`<div class="swiper-zoom-container"><img src=${imgs['url'][i]} /></div>`)
      }

      swiper.slideTo(clickIndex)
      $('#origin-img').fadeIn('fast')
      this.swiperStatus = true
    })

    // 切换图状态禁止页面缩放
    document.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1 && this.swiperStatus) {
        event.preventDefault()
      }
    })
    var lastTouchEnd = 0
    document.addEventListener('touchend', function (event) {
      var now = (new Date()).getTime()
      if (now - lastTouchEnd <= 100) {
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
