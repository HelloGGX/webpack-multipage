import './act-pay.less'
import 'components/banner/banner.less'
import model from 'api/getIndex'
import $ from 'jquery'
import {getQueryString} from 'common/js/dom'
let all = (function () {
  let Home = {
    pageInit () {
      $('.payways-main-li').on('click', (e) => {
        $(e.currentTarget).find('label').addClass('active').parents('.payways-main-li').siblings().find('label').removeClass('active')
      })
      this._getApplySuccess()
    },
    _getApplySuccess () {
      model.getApplySuccess({id: getQueryString('id'), clubId: getQueryString('clubId'), orderId: getQueryString('orderId')}).then(data => {

      }).catch(errMsg => {

      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
