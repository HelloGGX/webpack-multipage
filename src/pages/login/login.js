import './login.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'
import {setCookie} from 'common/js/dom'
import sha1 from 'sha1'
import vali from 'vendor/validate'

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
        weui.form.validate('#loginForm', function (error) {
          if (!error) {
            var loading = weui.loading('登陆中...')
            setTimeout(function () {
              loading.hide()
              _thi._postLoginData()
            }, 1000)
          }
        }, regexp)
      })
    },
    href (uid) {
      return `index.html?uid=${uid}`
    },
    _postLoginData () {
      let pass = $('input[name=password]').val()

      model.postLoginData($('#loginForm')).then((data) => {
        // 获取数据成功时的处理逻辑
        console.log(data)
        if (data.state === 'ok') { // 如果存在该用户
          weui.toast('登陆成功', 1000)
          setCookie('token', sha1(`${data.username}${pass}SD${'山渡户外119'}`), 1000 * 60)
          setCookie('username', data.username, 1000 * 60)
          window.location.href = this.href(data.uid)
          window.sessionStorage.setItem('ucl', data.ucl)
        } else if (data.state === 'loginno') {
          weui.alert('登陆不成功，请检查你的电话或密码是否正确')
        }
      }).catch((ErrMsg) => {
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
