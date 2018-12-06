import './person.less'
import 'components/banner/banner.less'
import { delCookie, imgSuffix } from 'common/js/dom'
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
      model.person
        .getPerData()
        .then((data) => {
          w.addEventListener('message', (event) => {
            $('#integral').html(event.data[0])
          })
          w.postMessage([ data ])
          if (window.sessionStorage.getItem('ucl') === '俱乐部') {
            $('#clubMag').hide()
          } else if (window.sessionStorage.getItem('ucl') === '用户') {
            $('#clubMag').hide()
            $('#memberMag').hide()
            $('#cash').hide()
          } else {
            $('#clubMag').hide()
            $('#memberMag').hide()
          }
          $('.per-head img').attr('src', imgSuffix(data.user_img, 2))
          $('.per-text h3').text(data.user_nice)
          $('.per-text p').text(`用户ID:${data.user_id}`)
          $($('.Alldata .data-item')[0]).find('h3').html(data.user_act)
          $($('.Alldata .data-item')[3]).find('h3').html(data.user_club)
          $($('.data-item')[0]).find('h3').html(data.act_num)
          $($('.data-item')[1]).find('h3').html(data.travel_num)
          $($('.data-item')[2]).find('h3').html(data.album_num)
          $($('.data-item')[3]).find('h3').html(data.club_num)
          $('#coin').html(data.user_coin)
        })
        .catch((errMsg) => {
          console.log(errMsg)
        })
    },
    _signOut () {
      model
        .signOut()
        .then((res) => {
          if (res.state === 'ok') {
            delCookie('username')
            delCookie('token')
            window.location.href = 'login.html'
          }
        })
        .catch((errMsg) => {
          weui.alert(errMsg)
        })
    }
  }
  return home
})()

$(function () {
  all.pageInit()
})
