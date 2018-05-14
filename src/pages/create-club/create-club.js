import './create-club.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import weui from 'weui.js'
import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import {pickerAddr} from 'components/picker/picker'// 引入地区和日期选择对象方法
import {clubItem} from '../addMainItem/addMainItem'// 添加主打项目 宣言 简介
import vali from 'vendor/validate'
let regexp = {
  regexp: {
    PHONE: vali.mobile()
  }
}
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

      $('#submitReview').click((e) => {
        if ($('#uploaderFiles li').length === 0) {
          weui.topTips('请上传俱乐部logo', 1000)
        } else {
          weui.form.validate('#createClub', function (error) {
            console.log(error)
            if (!error) {
              var loading = weui.loading('提交中...')
              setTimeout(function () {
                loading.hide()
                weui.toast('提交成功', 3000)
              }, 1500)
            }
          }, regexp)
        }
      })
    }
  }

  return home
}())

$(function () {
  all.pageInit()
})
