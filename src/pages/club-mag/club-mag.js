import './club-mag.less'
import 'components/banner/banner.less'
import model from 'api/getIndex'
import weui from 'weui.js'
import $ from 'jquery'
import { clear } from 'common/js/dom'

let all = (function () {
  let Home = {
    PENDPAGE: 1,
    PASSPAGE: 1,
    REFUSEPAGE: 1,
    pageInit () {
      $('.tit-group').on('click', (e) => {
        $(e.currentTarget).next().toggle(() => {
          if ($(e.currentTarget).find('i').hasClass('icon-unfold')) {
            $(e.currentTarget).find('i').removeClass('icon-unfold')
            $(e.currentTarget).siblings('.load-more').show()
          } else {
            $(e.currentTarget).find('i').addClass('icon-unfold')
            $(e.currentTarget).siblings('.load-more').hide()
          }
        })
      })
      $('.club-lists').on('click', '.club-item', (e) => {
        if ($(e.currentTarget).find('input[name=clubCheck]').is(':checked')) {
          $(e.currentTarget).find('input[name=clubCheck]').prop('checked', false)
        } else {
          $(e.currentTarget).find('input[name=clubCheck]').prop('checked', true)
        }
      })
      $('.pend-more').on('click', (e) => {
        this.PENDPAGE += 3
        var loading = weui.loading('加载中...')
        setTimeout(() => {
          loading.hide()
          this.getPendClub(this.PENDPAGE)
        }, 400)
      })
      $('.pass-more').on('click', (e) => {
        this.PASSPAGE += 3
        var loading = weui.loading('加载中...')
        setTimeout(() => {
          loading.hide()
          this.getPassClub(this.PASSPAGE)
        }, 400)
      })
      $('.refuse-more').on('click', (e) => {
        this.REFUSEPAGE += 3
        var loading = weui.loading('加载中...')
        setTimeout(() => {
          loading.hide()
          this.getRefuseClub(this.REFUSEPAGE)
        }, 400)
      })
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

      this._getAllClub()
    },

    do (flag) {
      let ids = []
      $('input[name=clubCheck]').each(function () {
        if ($(this).is(':checked')) {
          ids.push($(this).attr('id'))
        }
      })
      model.mag.checkClub({ id: ids, flag: flag }).then(res => {
        if (res.state === 'ok') {
          weui.alert('操作成功,系统将通知申请者')
          $('.pass-lists').html('')
          $('.pend-lists').html('')
          $('.refuse-lists').html('')
          this.PENDPAGE = 1
          this.PASSPAGE = 1
          this.REFUSEPAGE = 1
          this._getAllClub()
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    getRefuseClub (page) {
      model.mag.getCheckClub({ page: page, type: 'refuse' }).then(data => {
        if (data.state === 'ok') {
          let refuseClub = data.refuseClubs
          let refuseLen = refuseClub.length
          if (refuseLen === 0) {
            $('.refuse-lists').append(`<p style="text-align: center;font-size: 14px;line-height: 0.34rem;">已经没有数据了</p>`)
            $('.refuse-more').hide()
          } else {
            for (let i = 0; i < refuseLen; i++) {
              $('.refuse-lists').append(this.clubTemp(refuseClub, i))
            }
            $('.refuse-more').show()
          }
          $('.refuse-len').html(`${data.refusenum}`)
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    getPendClub (page) {
      model.mag.getCheckClub({ page: page, type: 'pend' }).then(data => {
        if (data.state === 'ok') {
          let checkClub = data.checkClub
          let checkLen = checkClub.length
          if (checkLen === 0) {
            $('.pend-lists').append(`<p style="text-align: center;font-size: 14px;line-height: 0.34rem;">已经没有数据了</p>`)
            $('.pend-more').hide()
          } else {
            for (let i = 0; i < checkLen; i++) {
              $('.pend-lists').append(this.clubTemp(checkClub, i))
            }
            $('.pend-more').show()
          }
          $('.pend-len').html(`${data.checknum}`)
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    getPassClub (page) {
      model.mag.getCheckClub({ page: page, type: 'pass' }).then(data => {
        if (data.state === 'ok') {
          let passClub = data.passClub
          let passLen = passClub.length
          if (passLen === 0) {
            $('.pass-lists').append(`<p style="text-align: center;font-size: 14px;line-height: 0.34rem;">已经没有数据了</p>`)
            $('.pass-more').hide()
          } else {
            for (let i = 0; i < passLen; i++) {
              $('.pass-lists').append(this.clubTemp(passClub, i))
            }
            $('.pass-more').show()
          }
          $('.pass-len').html(`${data.passnum}`)
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    _getAllClub () {
      model.mag.getCheckClub({ page: 1 }).then(data => {
        if (data.state === 'ok') {
          let checkClub = data.checkClub
          let passClub = data.passClub
          let refuseClub = data.refuseClubs
          let checkLen = checkClub.length
          let passLen = passClub.length
          let refuseLen = refuseClub.length
          $('.pend-len').html(`${data.checknum}`)
          $('.pass-len').html(`${data.passnum}`)
          $('.refuse-len').html(`${data.refusenum}`)

          for (let i = 0; i < checkLen; i++) {
            $('.pend-lists').append(this.checkTemp(checkClub, i))
          }
          for (let i = 0; i < refuseLen; i++) {
            $('.refuse-lists').append(this.clubTemp(refuseClub, i))
          }
          for (let i = 0; i < passLen; i++) {
            $('.pass-lists').append(this.clubTemp(passClub, i))
          }
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    clubTemp (data, i) {
      return `<div  id="${data[i].club_id}" class="weui-cell club-item">
      <div class="weui-cell__bd">
          <div class="check-club clearfix">
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
              <div class="check-club-type">
                 ${clear(`${data[i].club_type.map(key => `<span>${key}</span>`)}`)}
              </div>
          </div>
          <div class="check-slogan">
              <div class="slogan-txt">
                  <p>${data[i].club_slogan}</p>
              </div>
          </div>
      </div>
  </div>`
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
              <div class="check-club-type">
                  ${clear(`${data[i].club_type.map(key => `<span>${key}</span>`)}`)}
              </div>
          </div>
          <div class="check-slogan">
              <div class="slogan-txt">
                  <p>${data[i].club_slogan}</p>
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
