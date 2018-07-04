import './act-pay.less'
import 'components/banner/banner.less'
import model from 'api/getIndex'
import $ from 'jquery'
import weui from 'weui.js'
import {getQueryString, clear} from 'common/js/dom'
let all = (function () {
  let Home = {
    PRICE: 0, // 总价格
    pageInit () {
      $('.payways-main-li').on('click', (e) => {
        $(e.currentTarget).find('label').addClass('active').parents('.payways-main-li').siblings().find('label').removeClass('active')
      })
      $('.banner-left').on('click', (e) => {
        weui.confirm('确定要离开吗？', {
          title: '提示',
          buttons: [{
            label: '去意已决',
            type: 'primary',
            onClick: function () {
              window.location.href = 'orders.html?type=pend'
            }
          }, {
            label: '再想想',
            type: 'default',
            onClick: function () {

            }
          }]
        })
      })
      this._getApplySuccess()
      $('#payApply').on('click', () => {
        this._postPay()
      })
    },
    _guestTemp (data) {
      let mainPer = data[0].guestname

      return `${data.map(key => `
      <li>
      <input type="hidden" name="guestname" value='${key.guestname}'>
      <input type="hidden" name="guestphone" value='${key.guestshouji}'>
      <input type="hidden" name="guestjgcl" value='${key.guest_jgcl}'>
      <input type="hidden" name="guest_jg" value='${key.guest_jg}'>
      <input type="hidden" name="guest_bbm" value='${key.guest_bbm}'>
      
        <p class="order-username">${key.guestnice}-${key.guestshouji}</p>
        <p class="order-ticket">
          <span>${key.guest_jgcl}</span>
          <span>￥${key.guest_jg}</span>
          <span style="float: right">${key.guest_bbm === '0' ? '主报名人' : `${mainPer}帮报`}</span>
        </p>
      </li>
      `)}`
    },
    _postPay () {
      model.pay.postPay({orderId: getQueryString('orderId')}).then(res => {
        if (res.state === 'ok') {
          weui.alert('支付成功')
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    _getApplySuccess () {
      let _thi = this
      model.getApplySuccess({id: getQueryString('id'), clubId: getQueryString('clubId'), orderId: getQueryString('orderId')}).then(data => {
        let guest = data.guest
        let len = guest.length
        for (let i = 0; i < len; i++) {
          _thi.PRICE += Number(guest[i].guest_jg)
        }
        $('#coupon').next().find('.weui-cell__ft').html(`￥${_thi.PRICE}`)
        $('#actTitle').html(data.cpname)
        $('.pay-act-time').text(data.cpksdate)
        if (data.pay_onlin === '是') {
          $('#weiPay').find('input').attr('checked', 'true')
          $('#weiPay').find('label').addClass('active')
        } else if (data.pay_other === '是') {
          $('#otherPay').find('input').attr('checked', 'true')
          $('#otherPay').find('label').addClass('active')
        }
        $('#applyUnpay').html(clear(this._guestTemp(guest)))
        $('#edit').on('click', () => {
          window.location.href = `act-apply.html?id=${getQueryString('id')}&clubId=${getQueryString('clubId')}&orderId=${getQueryString('orderId')}`
        })
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
