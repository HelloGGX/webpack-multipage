import './review-g.less'
import $ from 'jquery'
import weui from 'weui.js'
import model from 'api/getIndex'
import {clear} from 'common/js/dom'

let batchReview = {
  inputTemp () {
    return `<div class="aler-input">
    <p>确定不通过报名吗？系统将退回该用户报名费用</p>
    <input type="text" name="alerInput" maxlength="30" placeholder="输入不通过原因，30字以内">
    <div style="margin-top:0.1rem">
    <a  class="weui-btn weui-btn_primary dialog-confirm">确定</a>
    <a  class="weui-btn weui-btn_default dialog-cancel" style="margin-top:10px">取消</a>
    </div>
    </div>`
  },
  init (initData) {
    $('.btn-review').on('click', () => {
      this.show()
    })
    $('#reviewCancel').on('click', () => {
      this.hide()
    })
    $('#reviewLists').on('click', '.batch-unreview-item', (e) => {
      this.selectItem(e.currentTarget)
    })
    $('#reviewAll').on('click', () => {
      if ($('.batch-unreview-item').find('input[name=labelItem]').is(':checked')) {
        $("input[name='labelItem']").attr('checked', false)// 全选
      } else {
        $("input[name='labelItem']").attr('checked', true)// 全选
      }
    })
    $('#passReview').on('click', () => { // 当点击审核通过
      this.postReview('pass', '', initData)
    })
    $('#failReview').on('click', () => { // 当点击审核不通过
      let _thi = this
      let flag = false
      Array.from($('#reviewLists input[name=labelItem]')).map((key) => {
        if ($(key).is(':checked')) {
          flag = true
        }
      })
      if (flag) { // 如果有选中的
        require.ensure([], () => {
          require('vendor/dialog')
          $.alert.aler({
            title: '温馨提示',
            content: this.inputTemp(),
            height: 'auto',
            blankclose: true,
            okCallback: function (e) {
              let reason = $(e.currentTarget).parent().prev().val()
              if (reason === '') {
                weui.alert('理由不能为空')
                return false
              } else {
                _thi.postReview('fail', reason, initData)
              }
            }
          })
        }, 'aler')
      } else {
        weui.alert('请先选择要审核的成员')
      }
    })
  },
  show () {
    $('#setReviewGroup').show()
  },
  hide () {
    $('#setReviewGroup').hide()
  },
  _unreviewItemTemp (data) { // 未审核人员模板
    if (data.length > 0) {
      return `${data.map(key => `
      <div  class="batch-unreview-item">
        <div class="weui-cell unreview-item-top">
          <div class="weui-cell__hd per-head"><img style="width:40px" src=${require(`../../imgs/icons/${key.guest_sex === '男' ? 'boy' : 'girl'}.jpg`)} alt=""></div>
            <div class="weui-cell__bd">
              <p class="f-m per-name">${key.guest_name}</p>
              <p class="f-s per-bbname">${key.guest_type === '0' ? `发起人` : `${key.guest_typename}帮报`}</p>
            </div>
            <div class="weui-cell__ft f-m">
            <p class="per-apply-cost">${key.guest_pricecl} ￥${key.guest_price}</p>
            <p class="per-pay-way">${key.guest_wxpay === '是' ? '微信支付' : ''}  ${key.guest_qtpay === '是' ? '其他支付方式' : ''} ${(key.guest_wxpay === '否' && key.guest_qtpay === '否') ? `免费` : ``}${key.guest_paystate === '1' ? `(已付款)` : `(未付款)`}</p>
            </div> 
            <div class="unreview-item-check">
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
  batchGetUnreviewPer (data) { // 批量审核里面获取未审核人员信息
    $('#reviewLists').html(clear(this._unreviewItemTemp(data)))
  },
  selectItem (e) {
    if ($(e).find('input[name=labelItem]').is(':checked')) {
      $(e).find('input[name=labelItem]').attr('checked', false)
    } else {
      $(e).find('input[name=labelItem]').attr('checked', true)
    }
  },
  postReview (juge, reason, initData) {
    let _thi = this
    let flag = false
    let arr = []// arr代表选中的队员id所组成的数组
    Array.from($('#reviewLists input[name=labelItem]')).map((key) => {
      if ($(key).is(':checked')) {
        arr.push($(key).attr('data-id'))
        flag = true
      }
    })
    if (flag) { // 如果有选中的
      model.magAct.reviewPer({perId: arr, call: juge, reason: reason}).then(res => {
        if (res.state === 'ok') { // 如果新建分组插入成功
          weui.alert('操作成功')
          _thi.hide()
          initData()
        }
      }).catch(errMsg => {
        console.log(errMsg)
      })
    } else {
      weui.alert('请先选择要审核的成员')
    }
  }

}
export {batchReview}
