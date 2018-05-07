import '../../components/banner/banner.less'
import './create-act.less'

import {pickerAddr, pickerData} from '../../components/picker/picker'// 引入地区和日期选择对象方法
import {upload} from '../../components/upload/upload'// 引入上传图片对象方法
import $ from 'jquery'

let all = (function () {
  let banner = {
    init () {
      this.setRight()
    },
    setRight () {
      $('.banner-right a').html('草稿箱')
      $('.banner-right a').attr('href', 'draft-box.html')
    }

  }
  let Home = {
    pageInit: function () {
      banner.init()
      $('.actTime').on('click', (e) => {
        pickerData.showDate(e.currentTarget)
      })

      $('.actAddr').on('click', (e) => {
        pickerAddr.showAddr(e.currentTarget)
      })

      $('.actCover').on('click', (e) => {
        upload.init()
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
