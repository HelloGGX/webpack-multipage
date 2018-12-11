import $ from 'jquery'
import weui from 'weui.js'
import './set-pay.less'
import model from 'api/getIndex'
import bank from 'api/bankData'
import { clear } from 'common/js/dom'
import vali from 'vendor/validate'

class SetPay {
//   constructor ({ orderId = null } = {}) {
//     this.orderId = orderId
//   }
  init () {
    $('select[name=bankName]').html(
      `${clear(`${bank.map(key => `
      <option value="${key.val}">${key.name}</option>
      `)}`)}`
    )
    this._getPayData()
    $('#setPayCancel').on('click', () => {
      this.hide()
    })
    $('#setPaySave').on('click', () => {
      this.setPayConfirm()
    })
  }
  hide () {
    $('#setPay').hide()
  }
  show () {
    $('#setPay').show()
  }
  _postPayData () {
    const _thi = this
    model.pay.postPayData($('#myPay')).then(res => {
      if (res.state === 'ok') {
        weui.alert('账户设置成功!')
        _thi.hide()
      }
    }).catch(errMsg => {
      weui.alert(errMsg)
    })
  }
  _getPayData () {
    // const _thi = this
    model.pay.getPayData().then(data => {
      if (data.state === 'ok') {
        $(`select[name=bankName] option[value=${data.bank_name}]`).attr('selected', 'selected')
        $('input[name=userName]').val(data.user_name)
        $('input[name=idNum]').val(data.id_num)
        $('input[name=idCard]').val(data.id_card)
      }
    }).catch(errMsg => {
      weui.alert(errMsg)
    })
  }
  setPayConfirm () {
    let _thi = this
    weui.form.validate('#myPay', function (error) {
      if (!error) {
        if (!vali.id($('input[name=idCard]').val())) {
          weui.form.showErrorTips({
            ele: document.getElementById('idCard'),
            msg: 'notMatch'
          })
        } else {
          var loading = weui.loading('提交中...')
          setTimeout(function () {
            loading.hide()
            _thi._postPayData()
          }, 1000)
        }
      }
    })
  }
}
export function setPay (opt) {
  return new SetPay().init()
}
