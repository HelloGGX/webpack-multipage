/* jshint esversion: 6 */
import './act-info-mag.less'
import 'components/banner/banner.less'
import 'components/tabs/tabs.less'
import $ from 'jquery'
import weui from 'weui.js'
import {pickerAddr, pickerData} from 'components/picker/picker' // 引入地区和日期选择对象方法
import {batchG} from '../batchGroup/batch-group'
import {addApplyPer} from '../addApplyPerson/add-apply-per'
import {showGroupPer} from '../showGroupPer/show-g-per'
import model from 'api/getIndex'
import {getQueryString} from 'common/js/dom'

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

    pageInit () {
      this._getData()
      this.switch()
      search.init()
      applyMagGroup.init()
      batchG.init()
      addApplyPer.init()
      showGroupPer.init()
      $('.actTime').on('click', (e) => {
        pickerData.showDate(e.currentTarget)
      })

      $('#openApply').on('click', (e) => { // 打开关闭活动
        model.magAct.openApply({id: getQueryString('id')}).then(res => {
          if (res.state === '0') { // 如果是活动打开的
            $('#openApply').find('button').html('关闭活动')
          } else if (res.state === '1') {
            $('#openApply').find('button').html('打开活动')
          }
        }).catch(errMsg => {

        })
      })

      $('#deleteAct').on('click', () => { // 删除活动
        weui.confirm('删除活动', {
          title: '确定要删除活动吗？',
          buttons: [{
            label: '考虑一下',
            type: 'default',
            onClick: function () { }
          }, {
            label: '心意已决',
            type: 'primary',
            onClick: function () {
              model.magAct.deleteAct(getQueryString('id')).then(res => {
                console.log(res)
                if (res.state === 'delete_ok') {
                  window.alert('删除成功')
                  window.history.go(-1)
                } else if (res.state === 'delete_no') {
                  window.alert('删除失败')
                  return false
                }
              }).catch(errMsg => {

              })
            }
          }]
        })
      })

      $('#editApply').on('click', () => { // 编辑活动

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
    switch () {
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
    },

    _getActInfoData (data) {
      let sales = data.list[0].sales
      let theme = data.list[0].act_name
      let detail = data.list[0].act_detail_text
      let applyEndTime = data.list[0].apply_endtime
      let actStartTime = data.list[0].act_kstime
      let actEndTime = data.list[0].act_jstime
      let actAddr = data.list[0].act_addr
      let actDetailAddr = data.list[0].act_addrs
      let actState = data.list[0].act_state
      if (actState === '关闭报名') {
        $('#openApply').find('button').html('打开活动')
      } else if (actState === '报名中') {
        $('#openApply').find('button').html('关闭活动')
      }
      $('#editApply a').attr('href', `act-create.html?id=${getQueryString('id')}`)
      $('.actInfoInner ul li:first').find('span').html(sales)
      $('#theme').val(theme)
      $('#actDetail').val(detail)
      $('#applyDeadline').val(applyEndTime)
      $('#actStartLine').val(actStartTime)
      $('#actEndLine').val(actEndTime)
      $('#Actaddr').val(actAddr)
      $('input[name=actDetailAddr]').val(actDetailAddr)
    },
    _getData () {
      model.getMagInfo({id: getQueryString('id')}).then(args => {
        this._getActInfoData(args[0])
        addApplyPer.getApplyData(args[1])
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
