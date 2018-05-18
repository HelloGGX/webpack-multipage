import $ from 'jquery'
import weui from 'weui.js'
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
  }
}
export {addApplyPer}
