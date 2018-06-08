import './batch-group.less'
import $ from 'jquery'
import weui from 'weui.js'
import {getQueryString, clear} from 'common/js/dom'
import model from 'api/getIndex'
import {moveToGroup} from 'components/moveToGroup/moveToGroup'

let batchG = {

  inputTemp: `<div class="aler-input">
  <input type="text" name="alerInput" maxlength="10" placeholder="请输入组名">
  <div id="saveGroupName" class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
  </div>`,
  lists: Array.from($('input[name=labelItem]')),
  init (initData) {
    $('#batchCancel').on('click', (e) => {
      this.hide()
    })
    $('.btn-batch').on('click', (e) => {
      this.show()
    })
    $('#batchUnclass').on('click', '.batch-unclass-item', (e) => {
      this.selectItem(e.currentTarget)
    })
    $('#moveToNewG').on('click', (e) => {
      this.moveToGroup(initData)
    })
    $('#addNewG').on('click', (e) => {
      this.addNewGroup(initData)
    })

    $('#batchAll').on('click', () => {
      if ($('.batch-unclass-item').find('input[name=labelItem]').is(':checked')) {
        $("input[name='labelItem']").attr('checked', false)// 全选
      } else {
        $("input[name='labelItem']").attr('checked', true)// 全选
      }
    })
  },
  _unclassItemTemp (data) { // 未分组人员模板
    if (data !== null) {
      return `${data.map(key => `
      <div  class="batch-unclass-item">
        <div class="weui-cell unclass-item-top">
          <div class="weui-cell__hd per-head"><img style="width:40px" src=${require(`../../imgs/icons/${key.guest_sex === '男' ? 'boy' : 'girl'}.jpg`)} alt=""></div>
            <div class="weui-cell__bd">
              <p class="f-m per-name">${key.guest_name}</p>
              <p class="f-s per-bbname">${key.guest_type === '0' ? `发起人` : `${key.guest_typename}帮报`}</p>
            </div>
            <div class="weui-cell__ft f-m">
            <p class="per-apply-cost">${key.guest_pricecl} ￥${key.guest_price}</p>
            <p class="per-pay-way">${key.guest_wxpay === '是' ? '微信支付' : ''}  ${key.guest_qtpay === '是' ? '其他支付方式' : ''} ${(key.guest_wxpay === '否' && key.guest_qtpay === '否') ? `免费` : ``}${key.guest_paystate === '1' ? `(已付款)` : `(未付款)`}</p>
            </div> 
            <div class="unclass-item-check">
              <input type="checkbox" class="weui-check" name="labelItem" data-id="${key.guest_id}">
              <i class="weui-icon-checked"></i>
            </div>
          </div>
        </div> 
      `)}`
    } else {
      return ''
    }
  },
  batchGetUnclassPer (data) { // 批量分组里面获取未分组人员信息
    $('#batchUnclass').html(clear(this._unclassItemTemp(data)))
  },

  selectItem (e) {
    if ($(e).find('input[name=labelItem]').is(':checked')) {
      $(e).find('input[name=labelItem]').attr('checked', false)
    } else {
      $(e).find('input[name=labelItem]').attr('checked', true)
    }
  },

  showAddGroup (arr, initData) { // 显示添加到新分组
    let _thi = this
    require.ensure([], () => {
      require('vendor/dialog')
      $.alert.aler({
        title: '添加到分组',
        content: this.inputTemp,
        height: '200',
        blankclose: true,
        okCallback: function () {
          _thi._addNewGroupData(arr, initData)
        }
      })
    }, 'aler')
  },
  moveToGroup (initData) {
    let flag = false
    let arr = []// arr代表选中的队员id所组成的数组
    Array.from($('input[name=labelItem]')).map((key) => {
      if ($(key).is(':checked')) {
        arr.push($(key).attr('data-id'))
        flag = true
      }
    })
    if (flag) { // 如果有选中的
      if ($('.g-lists .g-item').length > 0) { // 判断有分组存在
        moveToGroup({perIdArr: arr}).init()
      } else { // 如果还没有分组
        this.showAddGroup(arr, initData)
      }
    } else {
      weui.alert('请先选择要分组的成员')
    }
  },
  addNewGroup (initData) {
    let flag = false
    let arr = []
    Array.from($('input[name=labelItem]')).map((key) => {
      if ($(key).is(':checked')) {
        arr.push($(key).attr('data-id'))
        flag = true
      }
    })
    if (flag) { // 如果有选中的
      this.showAddGroup(arr, initData)
    } else {
      weui.alert('请先选择要分组的成员')
    }
  },

  _addNewGroupData (arr, initData) { // arr代表选中的队员id所组成的数组
    let _thi = this
    let groupName = $('input[name=alerInput]').val()
    // let perId =
    model.magAct.addGroup({id: getQueryString('id'), groupName: groupName, perId: arr}).then(res => {
      if (res.group_state === 'ok') { // 如果新建分组插入成功
        weui.alert('添加到新分组成功')
        _thi.hide()
        initData()// 再获取一次数据
      }
    }).catch(errMsg => {
      console.log(errMsg)
    })
  },
  hide () {
    $('#setBatchGroup').hide()
  },
  show () {
    $('#setBatchGroup').show()
  }

}

export {batchG}
