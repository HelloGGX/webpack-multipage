import './act-apply-mag.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'

let all = (function () {
  let Home = {
    pageInit () {
      this._getApplyHelp()
    },
    _getApplyHelp () {
      model.magAct.getApplyHelp().then(data => {
        console.log(data)
      }).catch(errMsg => {
        console.log(errMsg)
      })
    }

  }
  return Home
}())

$(function () {
  all.pageInit()
})
