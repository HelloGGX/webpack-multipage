import './act-apply.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'
import {getQueryString} from 'common/js/dom'

let all = (function () {
  let Home = {
    pageInit: function () {
      this._getApplyData()
    },
    _getApplyData: function () {
      model.getApplyData({id: getQueryString('id'), clubId: getQueryString('clubId')}).then((data) => {

      }).catch((errMess) => {

      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
