import './member-mag.less'
import 'components/banner/banner.less'
import weui from 'weui.js'
import model from 'api/getIndex'
import $ from 'jquery'

let all = (function () {
  let Home = {
    PENDPAGE: 1,
    PASSPAGE: 1,
    pageInit () {
      this.getAllMember()
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
      $('.pend-lists').on('click', '.pend-item', (e) => {
        if ($(e.currentTarget).find('input[name=checkUser]').is(':checked')) {
          $(e.currentTarget).find('input[name=checkUser]').prop('checked', false)
        } else {
          $(e.currentTarget).find('input[name=checkUser]').prop('checked', true)
        }
      })
      $('.pend-more').on('click', (e) => {
        this.PENDPAGE += 6
        var loading = weui.loading('加载中...')
        setTimeout(() => {
          loading.hide()
          this.getPendMember(this.PENDPAGE)
        }, 400)
      })
      $('.pass-more').on('click', (e) => {
        this.PASSPAGE += 6
        var loading = weui.loading('加载中...')
        setTimeout(() => {
          loading.hide()
          this.getPassMember(this.PASSPAGE)
        }, 400)
      })
      $('#pass').on('click', () => {
        this.checkMember(true)
      })
      $('#refuse').on('click', () => {
        this.checkMember(false)
      })
    },
    checkMember (flag) {
      let ids = []
      let checks = $('input[name=checkUser]')
      let len = checks.length
      for (let i = 0; i < len; i++) {
        if ($(checks[i]).is(':checked')) {
          ids.push($(checks[i]).attr('id'))
        }
      }
      if (ids.length > 0) {
        model.mag.checkMember({ ids: ids, flag: flag }).then(res => {
          if (res.state === 'ok') {
            weui.alert('操作成功')
            $('.pass-lists').html('')
            $('.pend-lists').html('')
            this.PENDPAGE = 1
            this.PASSPAGE = 1
            this.getAllMember()
          }
        }).catch(errMsg => {
          weui.alert(errMsg)
        })
      } else {
        weui.alert('请选择审核人员')
      }
    },
    getPendMember (page) {
      model.mag.getMember({ page: page, type: 'pend' }).then(data => {
        if (data.state === 'ok') {
          let checkUser = data.checkuser
          let checkLen = checkUser.length
          if (checkLen === 0) {
            $('.pend-lists').append(`<p style="text-align: center;font-size: 14px;line-height: 0.34rem;">已经没有数据了</p>`)
            $('.pend-more').hide()
          } else {
            for (let i = 0; i < checkLen; i++) {
              $('.pend-lists').append(this.checkTemp(checkUser, i))
            }
            $('.pend-more').show()
          }
          $('.pend-len').html(`${data.checknum}人`)
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    getPassMember (page) {
      model.mag.getMember({ page: page, type: 'pass' }).then(data => {
        if (data.state === 'ok') {
          let passUser = data.passuser
          let passLen = passUser.length
          if (passLen === 0) {
            $('.pass-lists').append(`<p style="text-align: center;font-size: 14px;line-height: 0.34rem;">已经没有数据了</p>`)
            $('.pass-more').hide()
          } else {
            for (let i = 0; i < passLen; i++) {
              $('.pass-lists').append(this.passTemp(passUser, i))
            }
            $('.pass-more').show()
          }
          $('.pass-len').html(`${data.passnum}人`)
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    passTemp (data, i) {
      return `<div class="weui-cell pass-item">
      <div id="${data[i].user_id}" class="weui-cell__bd pass-item-head">
        <img src="${data[i].user_img}" alt="">
        <div class="pass-item-info f-m">
            <p>${data[i].user_name}</p>
            <p>电话:<span>${data[i].user_phone}</span></p>
        </div>
      </div>
      <div class="weui-cell__ft pass-time">
          <span class="f-m">${data[i].user_time}</span>
      </div>
  </div>`
    },
    checkTemp (data, i) {
      return `<label class="weui-cell weui-check__label pend-item" for="c${i}">
      <div class="weui-cell__hd">
          <input type="checkbox"  class="weui-check" name="checkUser" id="${data[i].user_id}">
          <i class="weui-icon-checked"></i> 
      </div>
      <div class="weui-cell__bd pend-item-head">
          <img src="${data[i].user_img}" alt="">
          <div class="pend-item-info f-m">
              <p>${data[i].user_name}</p>
              <p>电话:<span>${data[i].user_phone}</span></p>
          </div>
      </div>
      <div class="weui-cell__ft pend-time">
          <span class="f-m">${data[i].user_time}</span>
      </div>
  </label>`
    },
    getAllMember () {
      model.mag.getMember({ page: 1 }).then(data => {
        if (data.state === 'ok') {
          let checkUser = data.checkuser
          let checkLen = checkUser.length
          let passUser = data.passuser
          let passLen = passUser.length
          $('.pend-len').html(`${data.checknum}人`)
          $('.pass-len').html(`${data.passnum}人`)
          for (let i = 0; i < checkLen; i++) {
            $('.pend-lists').append(this.checkTemp(checkUser, i))
          }
          for (let i = 0; i < passLen; i++) {
            $('.pass-lists').append(this.passTemp(passUser, i))
          }
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    }

  }
  return Home
}())

$(function () {
  all.pageInit()
})
