import './identity.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import weui from 'weui.js'
import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import model from 'api/getIndex'
// import {clear} from 'common/js/dom'

let all = (function () {
  let Home = {

    pageInit () {
      upload({maxLength: 1, id: 'frontID'})
      upload({maxLength: 1, id: 'BackID'})
      upload({maxLength: 1, id: 'hand'})
      $('#certified').click((e) => {
        let _thi = this
        weui.form.validate('#identityID', function (error) {
          if (!error) {
            var loading = weui.loading('提交中...')
            setTimeout(function () {
              loading.hide()
              _thi._postIdData()
            }, 1000)
          }
        })
      })
    },
    _postIdData () { // 提交俱乐部数据
      model.person.postIdData($('#identityID')).then((e) => {
        // 获取数据成功时的处理逻辑
        console.log(e)
        if (e.state === 'ok') {
          weui.alert('提交成功，等待审核')
        }
      }).catch((ErrMsg) => {
        // 获取数据失败时的处理逻辑
        weui.alert(ErrMsg)
      })
    }

  }
  return Home
}())

$(function () {
  all.pageInit()
})
