import $ from 'jquery'

$.alert = (function () {
  var storedInstance = null
  var Dialog = function () {
    this.title = '' // 标题
    this.type = 'alert-default' // 弹框类型
    this.content = '' // 内容  文字 || html
    this.height = 320 // 默认屏幕（父级）的320px
    this.width = 300 // 默认屏幕（父级）的300px
    this.delayTime = 0 // 效果延时时间，默认.5s
    this.cancelCallback = function () {}
    this.okCallback = function () {}
    this.blankclose = false// 点击遮罩关闭
    this.autoCloseTime = 1100
    this.autoClose = false
  }
  Dialog.prototype = {
    scrollTop: 0,
    init: function () {
      var _this = this
      $('body').append('<div class="dialog-backdrop"></div>')
      if ($('.alert-main').length > 0) {
        _this.closeModal()
      }
      _this.openModal()
      if (_this.title === '') {
        $('.alert-title').remove()
      };
      if (_this.autoClose) {
        _this.autoClo()
      };
      $('body').on('click', '.dialog-cancel', function (event) {
        _this.cancelCallback()
        _this.closeModal()
      })
      if (_this.blankclose) {
        $('body').on('click', '.dialog-backdrop', function (event) {
          _this.closeModal(event)
        })
      }
      $('body').on('click', '.dialog-confirm', function (e) {
        _this.okCallback(e)
        _this.closeModal()
      })
    },
    to: function (scrollTop) {
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop
    },
    getScrollTop: function () {
      return document.body.scrollTop || document.documentElement.scrollTop
    },
    autoClo: function () {
      var _this = this
      setTimeout(function () {
        _this.okCallback()
        _this.closeModal()
      }, _this.autoCloseTime)
    },
    openModal: function () {
      var _this = this
      var alertHtml = [
        '<section class="alert-main local-groups-popup-wrapper" id="alertMain">',
        '<div class="alert-content ' + this.type + '" id="alertContent">',
        '<div class="alert-title">' + this.title + '</div>',
        '<div class="alert-list">' + this.content + '</div>',
        '<div class="lgp-close alert-cancel dialog-cancel"></div>',
        '</div>',
        '</section>'
      ]
      $('body').append(alertHtml.join(''))
      $('#alertContent').css({
        'height': _this.height + 'px',
        'top': '20%',
        'width': _this.width + 'px',
        'left': '50%',
        'marginLeft': -_this.width / 2 + 'px',
        'display': 'block'
      })
      // _this.fixedBody();
      // 在弹出层显示之前，记录当前的滚动位置
      _this.scrollTop = _this.getScrollTop()

      // 使body脱离文档流
      document.body.classList.add('dialog-open')

      // 把脱离文档流的body拉上去！否则页面会回到顶部！
      document.body.style.top = -_this.scrollTop + 'px'
      setTimeout(function () {
        $('#alertContent').addClass('alert-show')
      }, _this.delayTime)
      $('.dialog-backdrop').addClass('backdrop-in')
    },
    closeModal: function (event) {
      var _this = this
      $('.dialog-backdrop').remove()
      // $('.dialog-backdrop').removeClass('backdrop-in')
      $('body').off('click', '.btn-bind button') // 解除绑定
      $('body').off('click', '.dialog-confirm') // 解除绑定
      $('#alertMain').remove()
      // body又回到了文档流中
      document.body.classList.remove('dialog-open')

      // 滚回到老地方
      _this.to(_this.scrollTop)

      if (event) {
        event.stopPropagation()
        event.preventDefault()
      } else {

      }
    }
  }
  return {
    aler: function (opts) {
      var dd = this.getDialog()
      var i
      for (i in opts) {
        if (dd.hasOwnProperty(i)) {
          dd[i] = opts[i]
        }
      }
      dd.init()
    },
    getDialog: function () {
      if (storedInstance == null) {
        storedInstance = new Dialog()
      }
      return storedInstance
    }
  }
})()
