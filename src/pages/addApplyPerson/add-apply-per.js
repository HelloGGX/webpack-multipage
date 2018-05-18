import $ from 'jquery'
import weui from 'weui.js'
import vali from 'vendor/validate'
let regexp = {
  regexp: {
    PHONE: vali.mobile()
  }
}
let addApplyPer = {
  init () {
    $('#setAlreadyPay').on('click', () => {
      weui.confirm('温馨提示', {
        title: '确定设为已付款',
        buttons: [{
          label: '取消',
          type: 'default',
          onClick: () => { console.log('no') }
        }, {
          label: '确定',
          type: 'primary',
          onClick: () => { console.log('yes') }
        }]
      })
    })

    $('#cancel').on('click', () => {
      $('#addApplyPer').hide()
    })
    $('.addPer').on('click', () => {
      $('#addApplyPer').show()
    })

    $('#savePer').on('click', () => {
      weui.form.validate('#addPerForm', function (error) {
        console.log(error)
        if (!error) {
          var loading = weui.loading('提交中...')
          setTimeout(function () {
            loading.hide()

            weui.toast('提交成功', 1000)
          }, 1500)
        }
      }, regexp)
    })
  }
}
export {addApplyPer}
