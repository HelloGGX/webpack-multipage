import './bank.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import banks from 'api/bankData'
import model from 'api/getIndex'
import {setBank} from '../setBank/set-bank'

let all = (function () {
  let bank = {
    init () {
      $('.list-bank ul').html(this.getBankData())
      setBank({intData: this._getPerData})
      this._getPerData()
    },
    getBankData () {
      const len = banks.length
      let html = ''
      for (let i = 0; i < len; i++) {
        html += this._bankTemp(banks, i)
      }
      return html
    },
    _getPerData () {
      model.person.getPerData().then(data => {
        const mybanks = data.user_bank
        const len = mybanks.length
        let html = ''
        if (mybanks !== '') { // 如果用户有银行账户
          $('.my-bank').html(`<div class="weui-cells__title">已设置账户</div><div class="my-list-bank"><ul></ul></div>`)
          for (let i = 0; i < len; i++) {
            html += bank._bankTemp(mybanks, i)
          }
          $('.my-list-bank ul').html(html)
        }
      }).catch(errMsg => {
        console.log(errMsg)
      })
    },
    _bankTemp (data, i) {
      return `<li>
        <a id="${i}" class="item-content" ${typeof (data[i].bank_id) !== 'undefined' ? `href=cash.html?bank_id=${data[i].bank_id}` : ''}>
            <div class="item-media">
                <img src="${typeof (data[i].src) !== 'undefined' ? data[i].src : require(`../../imgs/banks/${data[i].bank}.png`)}" alt="" style="width:34px">
            </div>
            <div class="item-inner">
                <div class="item-title f-m">${data[i].name}${typeof (data[i].card) !== 'undefined' ? `<span>尾号${data[i].card.replace(/.*(.{4})$/g, '$1')}</span>` : ''}</div>
            </div>
        </a>
    </li>`
    }
  }
  let Home = {
    pageInit () {
      bank.init()
    }

  }
  return Home
}())

$(function () {
  all.pageInit()
})
