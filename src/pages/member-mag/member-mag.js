import './member-mag.less'
import 'components/banner/banner.less'
import weui from '../../../node_modules/_weui.js@1.1.3@weui.js'
import $ from 'jquery'

class More {
  constructor ({
    _pendContent = [],
    _passContent = [],
    _default = 6, // 默认显示个人个数
    _loading = 10// 每次点击按钮后加载的个数
  } = {}) {
    this._pendContent = _pendContent
    this._passContent = _passContent
    this._default = _default
    this._loading = _loading
  }
  pendTemp (data, i) {
    return `<label class="weui-cell weui-check__label pend-item" for="c${i}"> 
    <div class="weui-cell__hd">
        <input  type="checkbox" class="weui-check" name="pendItem" id="${data.guest_id}">
        <i class="weui-icon-checked"></i> 
    </div> 
    <div class="weui-cell__bd pend-item-head">
        <img src="${data.guest_img === '' ? require('../../imgs/icons/boy.jpg') : data.guest_img}" alt="">
        <span class="f-m">${data.guest_name}</span>
    </div>
    <div class="weui-cell__ft">
        <a class="f-m" href="tel:${data.guest_phone}">电话</a>
    </div>
</label>`
  }
  passTemp () {

  }
  init (data, elem, type) {
    elem.html('')
    let len = this._default < data.length ? this._default : data.length
    if (type === 'pend') {
      for (let n = 0; n < len; n++) {
        elem.append(this.pendTemp(data, n))
      }
      for (let i = this._default; i < data.length; i++) {
        this._pendContent.push(this.pendTemp(data, i))
      }
    } else { // 如果是pass
      for (let n = 0; n < len; n++) {
        elem.append(this.passTemp(data, n))
      }
      for (let i = this._default; i < data.length; i++) {
        this._passContent.push(this.passTemp(data, i))
      }
    }
  }

  loadMore (elem, type) {
    let html = ''
    if (type === 'pend') {
      for (let i = 0; i < this._loading; i++) {
        let target = this._pendContent.shift()
        if (!target) {
          elem.find('.all-load').remove()
          elem.append('<p class="all-load">全部加载完毕...</p>')
          break
        }
        html += target
      }
    } else { // 如果是pass

    }
    var loading = weui.loading('加载中...')
    setTimeout(() => {
      loading.hide()
      elem.append(html)
    }, 400)
  }
}

let all = (function () {
  let Home = {
    pageInit: function () {
      let pendMore = new More()
      let passMore = new More()
      console.log(pendMore)
      console.log(passMore)
    }

  }
  return Home
}())

$(function () {
  all.pageInit()
})
