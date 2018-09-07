import './get-pwd.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'
// import {setCookie} from 'common/js/dom'

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

      $('.seePwd').on('click', (e) => {
        if ($(e.currentTarget).prev().find('input').attr('type') === 'password') {
          $(e.currentTarget).prev().find('input').attr('type', 'text')
        } else {
          $(e.currentTarget).prev().find('input').attr('type', 'password')
        }
      })

      $('#getCheckcode').on('click', (e) => {
        this._checkCode()
      })
      $('#complete').on('click', (e) => {
        let code = $('input[name=msgCheckCode]').val()
        let phone = $('input[name=username]').val()
        let patt = /^[0-9]{11}$/g
        if (code === '') {
          weui.alert('请填写验证码')
        } else if (!patt.test(phone)) {
          weui.alert('请检查手机号填写是否有误')
        } else {
          this._postLoginData()
        }
      })
    },
    href (uid) {
      return `index.html?uid=${uid}`
    },
    _postLoginData () {
      model.postLoginData($('#loginForm')).then((data) => {
        // 获取数据成功时的处理逻辑
        if (data.state === 'ok') { // 如果验证码正确
          weui.confirm('短信已经发送请耐心等待', {
            title: '提示',
            buttons: [{
              label: '取消',
              type: 'default',
              onClick: function () { console.log('no') }
            }, {
              label: '马上登陆',
              type: 'primary',
              onClick: function () { window.location.href = 'login.html' }
            }]
          })
        } else if (data.state === 'loginno') {
          weui.alert('登陆不成功，请检查你的电话或验证码是否正确')
        }
      }).catch((ErrMsg) => {
        // 获取数据失败时的处理逻辑
        weui.alert(ErrMsg)
      })
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
      model.codeCheck({phone: phone, type: 'findPwd'}).then((res) => {
        if (res.reist === 'no') {
          weui.alert('该手机号还没有注册，请检查你的手机号')
        }
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
