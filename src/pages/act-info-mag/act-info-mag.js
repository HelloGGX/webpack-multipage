import './act-info-mag.less'
import 'components/banner/banner.less'
import 'components/tabs/tabs.less'
import $ from 'jquery'
import {pickerAddr, pickerData} from 'components/picker/picker'// 引入地区和日期选择对象方法

let all = (function () {
  let Home = {
    pageInit: function () {
      $('.actTime').on('click', (e) => {
        pickerData.showDate(e.currentTarget)
      })

      $('.actAddr').on('click', (e) => {
        pickerAddr.showAddr(e.currentTarget)
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
