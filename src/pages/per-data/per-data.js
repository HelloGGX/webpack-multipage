import './per-data.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'

let all = (function () {
  let Home = {
    pageInit () {
      this._getPerData()
    },
    _getPerData () {
      model.person.getPerData().then(data => {
        console.log(data)

        $('#user_sign').html(data.user_sign)
        $('#user_job').html(data.user_office)
        $('#user_city').html(data.user_hometown)
        $('#user_sports').html(data.user_love)
        $('#user_foot').html(data.user_mark)
        $('.show-pic').find('img').attr('src', data.user_img)
        $('.show-name').find('h3').text(data.user_nice)
        $('.show-name').find('p').text(`会员ID${data.user_id}`)
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
