import './login-msg.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'
import { setCookie } from 'common/js/dom'
import vali from 'vendor/validate'

let regexp = {
  regexp: {
    PHONE: vali.mobile(),
    PASSWD: vali.password()
  }
}

let all = (function () {
  let Home = {
    InterValObj: null, // timer变量，控制时间
    count: 60, // 间隔函数，1秒执行
    pageInit () {
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
      $('#getCheckcode').on('click', (e) => {
        this._checkCode()
      })
    },
    href (uid) {
      return `index.html?uid=${uid}`
    },
    _checkCode () { // 检查手机号和验证码的正确性
      let phone = $('input[name=username]').val()
      let patt = /^[0-9]{11}$/g
      if (phone === '') {
        weui.alert('手机号不能为空')
      } else if (!patt.test(phone)) {
        weui.alert('请检查手机号填写是否有误')
      } else {
        this.sendMsg(phone)
      }
    },
    sendMsg (phone) { // 发送短信
      let curCount = this.count
      $('#getCheckcode').attr('disabled', 'true')
      $('#getCheckcode').val('请在' + curCount + '秒内输入验证码')
      this.InterValObj = window.setInterval(() => {
        if (curCount === 0) {
          window.clearInterval(this.InterValObj)// 停止计时器
          $('#getCheckcode').removeAttr('disabled')// 启用按钮
          $('#getCheckcode').val('重新发送验证码')
        } else {
          curCount--
          $('#getCheckcode').val('请在' + curCount + '秒内输入验证码')
        }
      }, 1000) // 启动计时器，1秒执行一次
      model.codeCheck({ phone: phone, type: 'loginMsg' }).then((res) => {
        if (res.reist === 'no') {
          weui.alert('该手机号还没有注册，请检查你的手机号')
        }
      })
    },
    _postLoginData () {
      model.postLoginData($('#loginForm')).then((data) => {
        // 获取数据成功时的处理逻辑

        if (data.state === 'ok') { // 如果存在该用户
          weui.toast('登陆成功', 1000)
          setCookie('token', data.token, 1000 * 60 * 60)
          setCookie('username', data.username, 1000 * 60 * 60)
          window.location.href = this.href(data.uid)
          window.sessionStorage.setItem('ucl', data.ucl)
        } else if (data.state === 'loginno') {
          weui.alert('登陆不成功，请检查你的电话或验证码是否正确')
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
