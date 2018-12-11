import './regist.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'
import vali from 'vendor/validate'
import { setCookie, delCookie } from 'common/js/dom'

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

      // $('.seePwd').on('click', (e) => {
      //   if ($(e.currentTarget).prev().find('input').attr('type') === 'password') {
      //     $(e.currentTarget).prev().find('input').attr('type', 'text')
      //   } else {
      //     $(e.currentTarget).prev().find('input').attr('type', 'password')
      //   }
      // })
      $('#getCheckcode').on('click', (e) => {
        this._checkCode()
      })

      $('#btn-submit').on('click', (e) => {
        let _thi = this
        weui.form.validate('#registForm', function (error) {
          if (!error) {
            var loading = weui.loading('注册中...')
            setTimeout(function () {
              loading.hide()
              _thi._postRegistData()
            }, 1000)
          }
        }, regexp)
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
      model.codeCheck({ phone: phone, type: 'regist' }).then((res) => {
      })
    },
    _postRegistData () {
      model.postRegistData($('#registForm')).then((data) => { // resolve状态的回调函数
        // 获取数据成功时的处理逻辑
        let username = $('input[name=username]').val()
        delCookie('username')
        delCookie('token')
        if (data.state === 'ok') { // 如果存在该用户"
          weui.toast('注册成功', 800)
          setCookie('username', `${username}`, 1000 * 60)
          setCookie('token', `${data.token}`, 1000 * 60)
          window.sessionStorage.setItem('ucl', data.ucl)
          window.location.href = `index.html?uid=${data.uid}`
        } else if (data.state === 'reg_y') {
          weui.alert('你已经注册过了,请直接登陆')
          setTimeout(() => {
            window.location.href = 'login.html'
          }, 3000)
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
