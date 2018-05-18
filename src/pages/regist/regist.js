import './regist.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'

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
        weui.form.validate('#registForm', function (error) {
          if (!error) {
            var loading = weui.loading('注册中...')
            setTimeout(function () {
              loading.hide()
              _thi._postRegistData()
              weui.toast('注册成功', 1000)
            }, 1500)
          }
        }, regexp)
      })
    },
    _postRegistData () {
      model.postRegistData($('#registForm')).then((data) => { // resolve状态的回调函数
        // 获取数据成功时的处理逻辑
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
