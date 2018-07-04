import './club-my.less'
import 'components/banner/banner.less'
import model from 'api/getIndex'
import {} from 'common/js/dom'
import $ from 'jquery'

let all = (function () {
  let Home = {
    pageInit () {
      this._getPerData()
    },
    _getPerData () {
      model.person.getPerData().then(data => {
        $('.per-head img').attr('src', data.user_img)
        let myClub = data.user_club_info
        let len = myClub.length
        let html = ''
        for (let i = 0; i < len; i++) {
          html += this.clubTemp(myClub, i)
        }
        $('.club-lists ul').html(html)
      }).catch(errMsg => {
        console.log(errMsg)
      })
    },
    jugeIntegral (star) {
      if (Number(star) <= 500) {
        return 1
      } else if (Number(star) <= 1000 && Number(star) > 500) {
        return 2
      } else if (Number(star) <= 1500 && Number(star) > 1000) {
        return 3
      } else if (Number(star) <= 2000 && Number(star) > 1500) {
        return 4
      } else if (Number(star) <= 2500 && Number(star) > 2000) {
        return 5
      } else if (Number(star) > 2500) {
        return 6
      }
    },
    clubTemp (data, i) {
      return `<li class="club-item">
      <div class="dots"></div>
      <div class="dots"></div>
      <div class="club-logo">
        <img src="${data[i].club_logo}">
      </div>
      <div class="club-info">
        <div class="club-title">
          <p>${data[i].club_name}</p>
        </div>
        <div class="club-id"><p>ID:${data[i].club_id}</p></div>
      </div>
      <div class="vip">
          <img src="${require(`../../imgs/icons/VIP${this.jugeIntegral(data[i].club_star)}@2x.png`)}" alt="">
          <p>${this.jugeIntegral(data[i].club_star)}星会员</p>
      </div>
  </li>`
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
