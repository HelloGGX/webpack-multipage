import './per-data-edit.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import weui from 'weui.js'
import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import {ages} from 'common/js/dom'
let all = (function () {
  let Home = {
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

      $('#signature').on('click', (e) => {
        require.ensure([], () => {
          require('vendor/dialog')
          $.alert.aler({
            title: '提示',
            content: this.textAreaTemp,
            height: 320,
            blankclose: true,
            okCallback: function () {
              $(e.currentTarget).val($('textarea[name=declaration]').val())
            }
          })
        }, 'aler')
      })

      $('#age').on('click', (e) => {
        weui.datePicker({
          start: 1760,
          end: 2030,
          defaultValue: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()],
          onChange: (result) => {
            console.log(result)
          },
          onConfirm: (result) => {
            let birth = result.toString().replace(/\W/g, '-')

            $(e.currentTarget).val(ages(birth.toString()))
          },
          id: 'datePicker',
          className: 'picker'
        })
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
