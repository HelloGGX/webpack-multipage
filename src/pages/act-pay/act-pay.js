import './act-pay.less'
import 'components/banner/banner.less'

import $ from 'jquery'

let all = (function () {
  let Home = {
    pageInit: function () {
      $('.payways-main-li').on('click', (e) => {
        $(e.currentTarget).find('label').addClass('active').parents('.payways-main-li').siblings().find('label').removeClass('active')
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
