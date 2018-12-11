import $ from 'jquery'
import weui from 'weui.js'
import './set-bank.less'
import { pickerAddr } from 'components/picker/picker'// 引入地区和日期选择对象方法
import model from 'api/getIndex'

class SetBank {
  constructor ({ intData = () => {} } = {}) {
    this.intData = intData
  }
  init () {
    $('.list-bank li').on('click', (e) => {
      this.show()
      $('input[name=bankName]').val($(e.currentTarget).find('.item-title').html())
    })
    $('#setBankCancel').on('click', () => {
      this.hide()
    })
    $('#setBankSave').on('click', () => {
      this.setBankConfirm()
    })
    $('.bank-addr').on('click', (e) => {
      pickerAddr.showAddr(e.currentTarget)
    })
  }
  hide () {
    $('#setBank').hide()
  }
  show () {
    $('#setBank').show()
  }
  _postBankData () {
    const _thi = this
    model.person.postBankData($('#mybank')).then(res => {
      if (res.state === 'ok') {
        weui.alert('账户设置成功!')
        _thi.hide()
        _thi.intData()// 刷新页面数据
      }
    }).catch(errMsg => {
      weui.alert(errMsg)
    })
  }
  setBankConfirm () {
    let _thi = this
    weui.form.validate('#mybank', function (error) {
      if (!error) {
        console.log($('input[name=idNum]').val())
        // if (luhmCheck($('input[name=idNum]').val())) { // 如果银行卡校验成功
        var loading = weui.loading('提交中...')
        setTimeout(function () {
          loading.hide()
          _thi._postBankData()
        }, 1000)
        // } else {
        //   weui.alert('银行卡号有问题,请重新输入')
        // }
      }
    })
  }
}
export function setBank (opt) {
  return new SetBank({
    intData: opt.intData
  }).init()
}
