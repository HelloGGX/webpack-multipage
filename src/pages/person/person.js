import './person.less'
import 'components/banner/banner.less'
import {delCookie} from 'common/js/dom'
import model from 'api/getIndex'
import weui from 'weui.js'
import $ from 'jquery'

let all = (function () {
  let home = {
    pageInit () {
      this._getPerData()
      $('.quit').on('click', () => {
        this._signOut()
      })
    },
    _getPerData () {
      model.person.getPerData().then(data => {
        console.log(data)
        $('.per-head img').attr('src', data.user_img)
        $('.per-text h3').text(data.user_nice)
        $('.per-text p').text(`用户ID:${data.user_id}`)
        $($('.Alldata .data-item')[0]).find('h3').html(data.user_act)
        $($('.Alldata .data-item')[3]).find('h3').html(data.user_club)
      }).catch(errMsg => {
        console.log(errMsg)
      })
    },
    _signOut () {
      model.signOut().then(res => {
        if (res.state === 'ok') {
          delCookie('username')
          delCookie('token')
          window.location.href = 'login.html'
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    }
  }
  return home
}())

$(function () {
  all.pageInit()
})
