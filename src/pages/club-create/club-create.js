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
    textAreaTemp: `<div class="weui-cells weui-cells_form margin">
    <div class="weui-cell">
        <div class="weui-cell__bd">
            <textarea name="declaration" class="weui-textarea" style="height: 1.4rem;" maxlength="200" placeholder="请输入文本" rows="3"></textarea>
            <div class="weui-textarea-counter"><span>0</span>/200</div>
            <div class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
        </div>
    </div>
  </div>`,
    pageInit () {
      $('#uploader .weui-cell_select').on('click', () => {
        upload.init({maxLength: 1, id: 'uploader'})
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
            if (!error) {
              var loading = weui.loading('提交中...')
              setTimeout(function () {
                loading.hide()
                _thi._postClubData()
              }, 1000)
            }
          }, regexp)
        }
      })
      $('#declaration').click((e) => {
        let _thi = this
        require.ensure([], () => {
          require('vendor/dialog')
          $.alert.aler({
            title: '提示',
            content: this.textAreaTemp,
            height: 320,
            blankclose: true,
            okCallback: function () {
              $(e.currentTarget).val(_thi.getVal())
            }
          })
        }, 'aler')
      })
      $('#introduction').click((e) => {
        let _thi = this
        require.ensure([], () => {
          require('vendor/dialog')
          $.alert.aler({
            title: '提示',
            content: this.textAreaTemp,
            height: 320,
            blankclose: true,
            okCallback: function () {
              $(e.currentTarget).val(_thi.getVal())
            }
          })
        }, 'aler')
      })
    },
    getVal () {
      return $('textarea[name=declaration]').val()
    },
    _postClubData () { // 提交俱乐部数据
      model.createClubData($('#createClub')).then((e) => {
        // 获取数据成功时的处理逻辑
        console.log(e)
        if (e.state === 'ok') {
          weui.alert('提交成功，等待审核')
        } else if (e.state === '402') {
          weui.alert('你已经创建了俱乐部，不能再次创建')
        }
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
