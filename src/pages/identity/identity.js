import './identity.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import {upload} from 'components/upload/upload'// 引入上传图片对象方法

let all = (function () {
  let Home = {

    pageInit () {
      upload({maxLength: 1, id: 'frontID'})
      upload({maxLength: 1, id: 'BackID'})
      upload({maxLength: 1, id: 'hand'})
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
