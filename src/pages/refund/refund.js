import './refund.less'
import 'components/banner/banner.less'
import model from 'api/getIndex'
import weui from 'weui.js'
import $ from 'jquery'

let all = (function () {
  let Home = {
    pageInit () {
      $('#agree').on('click', () => {
        if ($('.refund-item').length > 0) {
          this.do(true)
        }
      })

      $('#refuse').on('click', () => {
        if ($('.refund-item').length > 0) {
          this.do(false)
        }
      })
      $('.refund-lists').on('click', '.refund-item', (e) => {
        if ($(e.currentTarget).find('input[name=refundCheck]').is(':checked')) {
          $(e.currentTarget).find('input[name=refundCheck]').prop('checked', false)
        } else {
          $(e.currentTarget).find('input[name=refundCheck]').prop('checked', true)
        }
      })
      this._getRefund()
    },
    do (flag) {
      let ids = []
      $('input[name=refundCheck]').each(function () {
        if ($(this).is(':checked')) {
          ids.push($(this).attr('id'))
        }
      })

      model.orders.refund({id: ids, flag: flag}).then(res => {
        if (res.state === 'ok') {
          weui.alert('操作成功,系统将自动退钱给相应用户到微信')
          this._getRefund()
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    _getRefund () {
      model.orders.getRefund().then(data => {
        if (data.state === 'ok') {
          let refund = data.refund
          let len = refund.length
          let _html = ''
          for (let i = 0; i < len; i++) {
            _html += this.refundTemp(refund, i)
          }
          $('.refund-lists').html(_html)
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },

    refundTemp (data, i) {
      return `<label class="weui-cell weui-check__label refund-item" for="r${data[i].refund_id}">
      <div class="weui-cell__hd">
          <input type="checkbox" class="weui-check" name="refundCheck" id="${data[i].refund_id}" >
          <i class="weui-icon-checked"></i>
      </div>
      <div class="weui-cell__bd">
          <div class="refund-per">
              <div class="refund-per-head">
                  <img src="${data[i].per_head}" alt="">
                  <span>${data[i].refund_name}</span>
                  <div class="refund-time">${data[i].refund_time}</div>
              </div>
              <div class="refund-per-reason"><span>退款申请:</span>${data[i].refund_reason}</div>
          </div>
          <div class="refund-act">
              <div class="refund-act-title">
                  <p>${data[i].refund_act}</p>
              </div>
              <div class="refund-act-info">
                  <span class="refund-act-type">${data[i].refund_act_type}</span>
                  <span class="refund-act-price">￥ ${data[i].refund_act_price}</span>
              </div>
          </div>
      </div>
  </label>`
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
