import './club-mag.less'
import 'components/banner/banner.less'
import model from 'api/getIndex'
import weui from '../../../node_modules/_weui.js@1.1.3@weui.js'
import $ from 'jquery'
import {clear} from 'common/js/dom'

let all = (function () {
  let Home = {
    pageInit () {
      $('#pass').on('click', () => {
        if ($('.club-item').length > 0) {
          this.do(true)
        }
      })
      $('#refuse').on('click', () => {
        if ($('.club-item').length > 0) {
          this.do(false)
        }
      })
      $('.club-lists').on('click', '.view', (e) => {
        let detail = $(e.currentTarget).prev().val()
        require.ensure([], () => {
          require('vendor/dialog')
          $.alert.aler({
            title: '温馨提示',
            content: `<p>${detail}</p>`,
            height: 'auto',
            blankclose: true
          })
        }, 'aler')
      })

      $('.club-lists').on('click', '.club-item', (e) => {
        if ($(e.currentTarget).find('input[name=clubCheck]').is(':checked')) {
          $(e.currentTarget).find('input[name=clubCheck]').prop('checked', false)
        } else {
          $(e.currentTarget).find('input[name=clubCheck]').prop('checked', true)
        }
      })
      this._getCheckClub()
    },

    do (flag) {
      let ids = []
      $('input[name=clubCheck]').each(function () {
        if ($(this).is(':checked')) {
          ids.push($(this).attr('id'))
        }
      })

      model.mag.checkClub({id: ids, flag: flag}).then(res => {
        if (res.state === 'ok') {
          weui.alert('操作成功,系统将通知申请者')
          this._getCheckClub()
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    _getCheckClub () {
      model.mag.getCheckClub().then(data => {
        if (data.state === 'ok') {
          let club = data.checkClub
          let len = club.length
          let _html = ''
          for (let i = 0; i < len; i++) {
            _html += this.checkTemp(club, i)
          }
          $('.club-lists').html(_html)
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    checkTemp (data, i) {
      return `<label class="weui-cell weui-check__label club-item" for="r${i}">
      <div class="weui-cell__hd">
          <input type="checkbox" class="weui-check" name="clubCheck" id="${data[i].club_id}">
          <i class="weui-icon-checked"></i>
      </div>
      <div class="weui-cell__bd">
          <div class="check-club">
              <div class="check-club-logo">
                  <img src="${data[i].club_logo}" alt="">
                  <span>${data[i].club_name}</span>
                  <div class="check-time">${data[i].club_time}</div>
              </div>
             
              <div class="check-club-detail">
                <span>俱乐部详情:</span>
                <input type="hidden" name="clubIntro" value="${data[i].club_intro}">
                <button type="button" class="view">查看</button>
              </div>
          </div>
          <div class="check-slogan">
              <div class="slogan-txt">
                  <p>${data[i].club_slogan}</p>
              </div>
              <div class="check-club-type">
                 ${clear(`${data[i].club_type.map(key => `<span>${key}</span>`)}`)}
              </div>
          </div>
      </div>
  </label>`
    }

  }
  return Home
}())

$(function () {
  all.pageInit()
})
