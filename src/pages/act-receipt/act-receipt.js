import './act-receipt.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'
import { getQueryString } from 'common/js/dom'
import work from 'webworkify-webpack'

class More {
  constructor ({
    _content = [],
    _default = 6, // 默认显示个人个数
    _loading = 10// 每次点击按钮后加载的个数
  } = {}) {
    this._content = _content
    this._default = _default
    this._loading = _loading
  }
  temp (data, i) {
    return `<div class="apply-item">
      <div class="weui-cell apply-item-top">
          <div class="weui-cell__bd">
              <p class="f-m per-name">${data[i].guest_name}(县里帮报)</p>
              <p class="f-s per-bbname">${data[i].guest_regdate}</p>
          </div>
          <div class="weui-cell__ft">
              <p class="per-apply-cost ${data[i].guest_apply_type === '0' ? 'green' : ''}">${data[i].guest_apply_type === '0' ? '+' : '-'}${data[i].guest_price}</p>
              <p class="per-pay-way">${data[i].guest_pricename}</p>
          </div>      
      </div>
  </div>`
  }

  init (data, elem) {
    elem.html('')
    let len = this._default < data.length ? this._default : data.length
    for (let n = 0; n < len; n++) {
      elem.append(this.temp(data, n))
    }
    for (let i = this._default; i < data.length; i++) {
      this._content.push(this.temp(data, i))
    }
  }

  loadMore (elem) {
    let html = ''
    for (let i = 0; i < this._loading; i++) {
      let target = this._content.shift()
      if (!target) {
        elem.find('.all-load').remove()
        elem.append('<p class="all-load">全部加载完毕...</p>')
        break
      }
      html += target
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
    pageInit () {
      $('.tit-group').on('click', (e) => {
        $(e.currentTarget).next().toggle(() => {
          if ($(e.currentTarget).find('i').hasClass('icon-unfold')) {
            $(e.currentTarget).find('i').removeClass('icon-unfold')
            $(e.currentTarget).siblings('.load-more').show()
          } else {
            $(e.currentTarget).find('i').addClass('icon-unfold')
            $(e.currentTarget).siblings('.load-more').hide()
          }
        })
      })

      this._getReceipt()
    },
    _getReceipt () {
      let w = work(require.resolve('./act-receipt-api.js'))
      model.orders.getReceipt({ actId: getQueryString('id') }).then((data) => {
        w.addEventListener('message', event => {
          let paidMore = new More()
          let refundMore = new More()

          paidMore.init(event.data[0], $('.apply-lists'))
          refundMore.init(event.data[1], $('.refund-lists'))
          $('.apply-len').html(`${event.data[0].length}人`)
          $('.refund-len').html(`${event.data[1].length}人`)

          $('.paid-more').on('click', (e) => {
            paidMore.loadMore($('.apply-lists'))
          })
          $('.refund-more').on('click', (e) => {
            refundMore.loadMore($('.refund-lists'))
          })
        })
        w.postMessage([data])

        $('#actTitle').html(data.act_name)
        $('.pay-act p:first').text(`活动时间:${data.act_ksdate}`)
        $('.pay-act p:last').text(`收款账户:${data.act_op}`)
        $('.pay-act a').attr('href', `act-detail.html?id=${data.act_id}`)
        $('.receipt-num p').text(`实收￥${data.act_money === '' ? 0 : data.act_money}元`)
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
