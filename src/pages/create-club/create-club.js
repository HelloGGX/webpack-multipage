import './create-club.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import {upload} from 'components/upload/upload'// 引入上传图片对象方法

let all = (function () {
  let home = {
    pageInit: function () {
      $('#uploader .weui-cell_select').on('click', () => {
        upload.init({maxLength: 1, fileVal: 'imgfile'})
      })
    }
  }

  return home
}())

$(function () {
  all.pageInit()
})
