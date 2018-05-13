import './create-club.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import {pickerAddr} from 'components/picker/picker'// 引入地区和日期选择对象方法
import {clubItem} from '../addMainItem/addMainItem'

let all = (function () {
  let home = {
    pageInit: function () {
      $('#uploader .weui-cell_select').on('click', () => {
        upload.init({maxLength: 1, fileVal: 'imgfile'})
      })
      $('.actAddr').on('click', (e) => {
        pickerAddr.showAddr(e.currentTarget)
      })
      clubItem.init()
    }
  }

  return home
}())

$(function () {
  all.pageInit()
})
