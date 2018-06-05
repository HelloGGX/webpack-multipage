import './act-pay.less'
import 'components/banner/banner.less'
import model from 'api/getIndex'
import $ from 'jquery'
import {getQueryString, clear} from 'common/js/dom'
let all = (function () {
  let Home = {
    pageInit () {
      $('.payways-main-li').on('click', (e) => {
        $(e.currentTarget).find('label').addClass('active').parents('.payways-main-li').siblings().find('label').removeClass('active')
      })
      this._getApplySuccess()
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
      
        <p class="order-username">${key.guestname}-${key.guestshouji}</p>
        <p class="order-ticket">
          <span>${key.guest_jgcl}</span>
          <span>￥${key.guest_jg}</span>
          <span style="float: right">${key.guest_bbm === '0' ? '主报名人' : `${mainPer}帮报`}</span>
        </p>
      </li>
      `)}`
    },
    _getApplySuccess () {
      model.getApplySuccess({id: getQueryString('id'), clubId: getQueryString('clubId'), orderId: getQueryString('orderId')}).then(data => {
        let guest = data.guest
        $('#applyUnpay').html(clear(this._guestTemp(guest)))
      }).catch(errMsg => {

      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
