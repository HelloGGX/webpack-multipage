import './person.less'
import 'components/banner/banner.less'
import {delCookie, imgSuffix} from 'common/js/dom'
import model from 'api/getIndex'
import weui from 'weui.js'
import $ from 'jquery'
import work from 'webworkify-webpack'

let all = (function () {
  let home = {
    pageInit () {
      this._getPerData()
      $('.quit').on('click', () => {
        this._signOut()
      })
    },
    _getPerData () {
      let w = work(require.resolve('./calculat.js'))
      model.person.getPerData().then(data => {
        w.addEventListener('message', event => {
          $('#integral').html(event.data[0])
        })
        w.postMessage([data])
        $('.per-head img').attr('src', imgSuffix(data.user_img, 2))
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
