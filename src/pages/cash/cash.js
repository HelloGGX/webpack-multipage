import './cash.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'
import { getQueryString } from 'common/js/dom'

let all = (function () {
  let Home = {
    pageInit () {
      this._getPerData()
      $('#confirmCash').on('click', () => {
        this.comfirmCash()
      })
    },
    _accountTemp (data, i) {
      return ` <a class="weui-cell weui-cell_access" href="bank.html">
      <div class="weui-cell__hd"><img src="${require(`../../imgs/banks/${data[i].bank}.png`)}" alt="" style="width:0.4rem;margin-right:0.1rem;display:block"></div>
      <div class="weui-cell__bd">
          <p class="f-m">${data[i].bank}</p>
          <p class="f-s">尾号${data[i].card.replace(/.*(.{4})$/g, '$1')}</p>
      </div>
      <div class="weui-cell__ft"></div>
  </a>`
    },
    comfirmCash () { // 确认提现
      model.person.postCash($('#cash')).then(res => {
        if (res.state === 'ok') {
          weui.alert('提现申请成功，正在审核中')
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    _getPerData () {
      let _thi = this
      model.person.getPerData().then(data => {
        $('.moneyNum').find('span').html(data.user_money)
        let banks = data.user_bank
        let len = banks.length
        if (getQueryString('bank_id') !== null) { // 如果已经有账户了
          $('#setCash').hide()
          console.log(getQueryString('bank_id'))

          for (let i = 0; i < len; i++) {
            if (banks[i].bank_id === parseInt(getQueryString('bank_id'))) {
              $('#setCash').before(_thi._accountTemp(banks, i))
              $('input[name=bankId]').val(banks[i].bank_id)
              $('input[name=bankName]').val(banks[i].bank)
              $('input[name=bankNum]').val(banks[i].card)
            }
          }
        } else {
          $('#setCash').show()
        }
      }).catch(errMsg => {
        console.log(errMsg)
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
