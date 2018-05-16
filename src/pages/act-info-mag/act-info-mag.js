import './act-info-mag.less'
import 'components/banner/banner.less'
import 'components/tabs/tabs.less'
import $ from 'jquery'
import {pickerAddr, pickerData} from 'components/picker/picker'// 引入地区和日期选择对象方法

let all = (function () {
  let textAreaTemp = `<div class="weui-cells weui-cells_form margin">
  <div class="weui-cell">
      <div class="weui-cell__bd">
          <textarea name="theme" class="weui-textarea" style="height: 1.4rem;" maxlength="100" placeholder="请输入活动主题" rows="3"></textarea>
          <div class="weui-textarea-counter"><span>0</span>/100</div>
          <div class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
      </div>
  </div>
</div>`
  let Home = {
    pageInit: function () {
      this.switch()
      $('.actTime').on('click', (e) => {
        pickerData.showDate(e.currentTarget)
      })

      $('.actAddr').on('click', (e) => {
        pickerAddr.showAddr(e.currentTarget)
      })
      $('#theme').click((e) => {
        let _thi = this
        require.ensure([], () => {
          require('vendor/dialog')
          $.alert.aler({
            title: '提示',
            content: textAreaTemp,
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
      return $('textarea[name=theme]').val()
    },
    switch: function () {
      let TYPE
      $('.nav_fixed_catgoods').on('click', '.fixed_nav_item_catgoods', (e) => {
        $(e.currentTarget).find('span').addClass('nav_cur_cat').parent().siblings().find('span').removeClass('nav_cur_cat')
        TYPE = $(e.currentTarget).data('type')
        if (TYPE === 'baseInfo') {
          $('.act-base-info').show().siblings().hide()
        } else {
          $('.act-mag').show().siblings().hide()
        }
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
