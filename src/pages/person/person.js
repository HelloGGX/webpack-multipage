import './person.less'
import 'components/banner/banner.less'
import {delCookie} from 'common/js/dom'
import $ from 'jquery'

let all = (function () {
  let home = {
    pageInit: function () {
      $('.quit').on('click', () => {
        delCookie('username')
        delCookie('password')
      })
    }
  }
  return home
}())

$(function () {
  all.pageInit()
})
