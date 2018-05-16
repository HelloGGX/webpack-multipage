import './login.less'
import $ from 'jquery'

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
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
