import './notice.less'
import 'components/banner/banner.less'
import $ from 'jquery'

let all = (function () {
  let Home = {
    pageInit: function () {
      $('#vip').on('click', () => {
        $('#vipCover').show()
      })
      $('#vipCancel').on('click', () => {
        $('#vipCover').hide()
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
