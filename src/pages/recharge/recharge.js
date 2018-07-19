import './recharge.less'
import 'components/banner/banner.less'
import model from '../../api/getIndex'
import weui from 'weui.js'
import $ from 'jquery'

let all = (function () {
  let selector = {
    NUM: Number($('.sd-coin a').html()),
    init () {
      $('#sku-input').on('input propertychange', function (e) {
        if (!/^\d+$/.test(this.value)) {
          this.value = 1
        }
      })
      $('.sku-selector-reduce').on('click', (e) => {
        this.reduce()
      })
      $('.sku-selector-increase').on('click', (e) => {
        this.increase()
      })
      $('#moneyChang').on('click', () => {
        if (this.NUM >= 500) {
          if (Number($('#sku-input').val()) > this.NUM) {
            weui.alert('兑换的度币不够啦')
          } else if (Number($('#sku-input').val()) <= 0) {
            weui.alert('兑换的度币不能为零或负')
          } else {
            model.postCoin({coin: $('#sku-input').val()}).then(res => {
              if (res.state === 'ok') {
                weui.alert('操作成功')
              }
            }).catch(errMsg => {
              weui.alert(errMsg)
            })
          }
        } else {
          weui.alert('兑换基数需要在500个度币才可以兑换')
        }
      })
    },
    increase () {
      let num = $('#sku-input').val()
      if (Number(num) + 1 > this.NUM) {
        return false
      } else if (Number(num) < 0) {
        $('#sku-input').val(0)
      } else {
        $('#sku-input').val(Number(num) + 1)
      }
    },
    reduce () {
      let num = $('#sku-input').val()
      if (Number(num) - 1 < 0) {
        return false
      } else if (Number(num) > this.NUM) {
        $('#sku-input').val(this.NUM)
      } else {
        $('#sku-input').val(Number(num) - 1)
      }
    }
  }
  let Home = {
    pageInit () {
      selector.init()
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
