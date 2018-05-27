import './regist.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'
import sha1 from 'sha1'
import vali from 'vendor/validate'
import {setCookie, delCookie} from 'common/js/dom'

let regexp = {
  regexp: {
    PHONE: vali.mobile(),
    PASSWD: vali.password()
  }
}

let all = (function () {
  let Home = {
    pageInit: function () {
      $('.am-list-control').find('input').on('input propertychange', function () {
        var result = $(this).val()
        if (result.length > 0) {
          $(this).parent().next('.am-list-action').find('i').show()
        } else {
          $(this).parent().next('.am-list-action').find('i').hide()
        }
      })

      $('.removeVal').on('click', (e) => {
        $(e.currentTarget).prev().find('input').val('')
      })

      $('.seePwd').on('click', (e) => {
        if ($(e.currentTarget).prev().find('input').attr('type') === 'password') {
          $(e.currentTarget).prev().find('input').attr('type', 'text')
        } else {
          $(e.currentTarget).prev().find('input').attr('type', 'password')
        }
      })

      $('#btn-submit').on('click', (e) => {
        let _thi = this
        weui.form.validate('#registForm', function (error) {
          if (!error) {
            var loading = weui.loading('注册中...')
            setTimeout(function () {
              loading.hide()
              _thi._postRegistData()
            }, 1500)
          }
        }, regexp)
      })
    },
    _postRegistData () {
      model.postRegistData($('#registForm')).then((data) => { // resolve状态的回调函数
        // 获取数据成功时的处理逻辑
        delCookie('username')
        delCookie('password')
        if (data.state === 'ok') { // 如果存在该用户"
          weui.toast('注册成功', 800)
          setCookie('username', sha1(`${data.username}SD${'山渡户外119'}`), 1000 * 60)
          setCookie('password', sha1(`${data.password}SD${'山渡户外119'}`), 1000 * 60)
          window.location.href = `index.html?uid=${data.uid}`
        } else if (data.state === 'reg_y') {
          weui.alert('你已经注册过了,请直接登陆')
          window.location.href = 'login.html'
        }
      }).catch((ErrMsg) => { // reject状态的回调函数
        // 获取数据失败时的处理逻辑
        weui.alert(ErrMsg)
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
