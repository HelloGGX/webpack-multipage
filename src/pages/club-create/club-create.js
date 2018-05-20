import './club-create.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import weui from 'weui.js'
import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import {pickerAddr} from 'components/picker/picker'// 引入地区和日期选择对象方法
import {clubItem} from '../addMainItem/addMainItem'// 添加主打项目 宣言 简介
import vali from 'vendor/validate'
import model from 'api/getIndex'
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
          let _thi = this
          weui.form.validate('#createClub', function (error) {
            console.log(error)
            if (!error) {
              var loading = weui.loading('提交中...')
              setTimeout(function () {
                loading.hide()
                _thi._postClubData()
                weui.toast('提交成功', 1000)
              }, 1500)
            }
          }, regexp)
        }
      })
    },
    _postClubData: function () { // 提交俱乐部数据
      model.createClubData($('#createClub')).then((e) => {
        // 获取数据成功时的处理逻辑
        if (e.state === 'ok') {
          weui.alert('提交成功，等待审核')
        }

        weui.alert('提交成功')
      }).catch((ErrMsg) => {
        // 获取数据失败时的处理逻辑
        weui.alert('数据获取有误')
      })
    }
  }

  return home
}())

$(function () {
  all.pageInit()
})
