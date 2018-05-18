/* jshint esversion: 6 */
import './act-info-mag.less'
import 'components/banner/banner.less'
import 'components/tabs/tabs.less'
import $ from 'jquery'
import weui from 'weui.js'
import {pickerAddr, pickerData} from 'components/picker/picker' // 引入地区和日期选择对象方法
import {batchG} from '../batchGroup/batch-group'
import {addApplyPer} from '../addApplyPerson/add-apply-per'
let all = (function () {
  let search = {// 搜索框显示及查询

    init () {
      $('body').on('click', '.cancel-search', () => {
        this.hide()
      })

      $('body').on('click', '.searchbar', () => {
        this.show()
      })
      this.searchange()

      $('body').on('click', '.search', () => {
        var inputVal = $('#view-input').val().trim()
        // alert(inputVal)
        this.searchVal(inputVal)
      })

      $('body').on('click', '.recent-history-list', (e) => {
        var val = $(e.currentTarget).html().trim()
        this.searchVal(val)
      })
      $('.search-recent-list-view .recent-history-list').on('click', (e) => {
        var val = $(e.currentTarget).html().trim()
        this.searchVal(val)
      })
      $('.btn-reset').on('click', () => {
        $('#view-input').val('')
        $('.cancel-button-view').removeClass('search')
        $('.cancel-button-view').addClass('cancel-search')
        $('.cancel-button-view').html('返回')
        $('.btn-reset').hide()
      })
    },
    show () {
      $('.search-view-container').css('visibility', 'visible')
      $('.search-view-container').css('display', 'block')
    },
    hide () {
      $('.search-view-container').css('visibility', 'hidden')
      $('.search-view-container').css('display', 'none')
    },
    searchange () {
      $('#view-input').bind('input propertychange', (e) => {
        var newval = $(e.currentTarget).val()
        if (newval.length > 0) {
          $('.cancel-button-view').addClass('search')
          $('.cancel-button-view').removeClass('cancel-search')
          $('.cancel-button-view').html('搜索')
          $('.btn-reset').show()
        } else {
          $('.cancel-button-view').removeClass('search')
          $('.cancel-button-view').addClass('cancel-search')
          $('.cancel-button-view').html('返回')
          $('.btn-reset').hide()
        }
      })
    },
    searchVal (val) {

    }
  }
  let textAreaTemp = `<div class="weui-cells weui-cells_form margin">
  <div class="weui-cell">
      <div class="weui-cell__bd">
          <textarea name="theme" class="weui-textarea" style="height: 1.4rem;" maxlength="100" placeholder="请输入活动主题" rows="3"></textarea>
          <div class="weui-textarea-counter"><span>0</span>/100</div>
          <div class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
      </div>
  </div>
</div>`

  let applyMagGroup = { // 分组报名成员对象

    init () {
      $('.unclass-item .weui-cell').on('click', (e) => {
        this.unclassItemShow(e)
      })
      $('.tit-group .txt-group').on('click', (e) => {
        $(e.currentTarget).parent().next('.unclass-lists').toggle()
      })
      $('.unclass-item').on('click', '.btn-audit', (e) => {
        this.singleClass(e)
      })
    },
    unclassItemShow (e) { // 未分组单个成员的显示隐藏切换
      $(e.currentTarget).next('.moreInfo').toggle()
    },
    singleClass (e) { // 单个分组
      if (batchG.len > 0) { // 如果有分组
        batchG.showGroup()
      } else { // 如果没有分组
        weui.confirm('请先在"批量分组"中创建分组')
      }
    }
  }
  let Home = {
    pageInit: function () {
      this.switch()
      search.init()
      applyMagGroup.init()
      batchG.init()
      addApplyPer.init()
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
