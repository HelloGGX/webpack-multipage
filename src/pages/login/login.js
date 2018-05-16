import './login.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'

import vali from 'vendor/validate'

let regexp = {
  regexp: {
    PHONE: vali.mobile()
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

      $('.am-list-action').on('click', (e) => {
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
              weui.toast('登陆成功', 1000)
            }, 1500)
          }
        }, regexp)
      })
    },
    _postLoginData () {
      model.postLoginData($('#loginForm')).then((data) => {
        // 获取数据成功时的处理逻辑
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
