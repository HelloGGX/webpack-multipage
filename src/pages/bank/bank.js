import './bank.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import banks from 'api/bankData'
import {setBank} from '../setBank/set-bank'

let all = (function () {
  let bank = {
    init () {
      $('.list-bank ul').html(this.getBankData())
      setBank()
    },
    getBankData () {
      const len = banks.length
      let html = ''
      for (let i = 0; i < len; i++) {
        html += this._bankTemp(banks, i)
      }
      return html
    },
    _bankTemp (data, i) {
      return `<li>
        <a id="${i}"  class="item-content" >
            <div class="item-media">
                <img src="${data[i].src}" alt="" style="width:34px">
            </div>
            <div class="item-inner">
                <div class="item-title f-m">${data[i].name}</div>
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
