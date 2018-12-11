import './act-apply-mag.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'
import { getQueryString, clear, itemtoArraytop, converToDate } from 'common/js/dom'

let all = (function () {
  let Home = {
    DATA: null,
    applyItem: {},
    realNameTemp (data) { // 真实姓名
      return `<div class="weui-cell">
      <div class="weui-cell__hd"><label class="weui-label">真实姓名</label></div>
      <div class="weui-cell__bd">
          <input  class="weui-input text-right color-grey" required emptyTips="请输入真实姓名" readonly="true" name="realName" type="text" placeholder="你的姓名" value="${data.guest_realname}">
      </div>
  </div>`
    },
    sexTemp (data) { // 性别
      let sexData = ['男', '女']
      let sexArray = itemtoArraytop(sexData, sexData.indexOf(data.guest_sex))
      return `<div class="weui-cell weui-cell_select weui-cell_select-after">
          <div class="weui-cell__hd">
            <label for="" class="weui-label">性别</label>
          </div>
          <div class="weui-cell__bd">
            <select class="weui-select select-r color-grey"  name="sex" disabled="disabled" value="${data.guest_sex}">
                ${clear(`${sexArray.map(item => `
                <option value="${item}">${item}</option>
                `)}`)}
            </select>
          </div>
          </div>`
    },
    idCard (data) { // 身份证
      return `<div  class="weui-cell">
      <div class="weui-cell__hd"><label class="weui-label">身份证</label></div>
      <div class="weui-cell__bd">
          <input class="weui-input text-right color-grey" required pattern="REG_IDNUM" name="idCard" readonly="true" type="text" placeholder="请输入身份证号码" emptyTips="请输入身份证号码" notMatchTips="请输入正确的身份证号码" value="${data.guest_idcard}">
      </div>
  </div>`
    },
    fixTemp (data, guest) { // 万年不变的固定选项
      let applyInfo = data.actForm
      let price = applyInfo.Price

      return `
      <div class="weui-cell weui-cell_select weui-cell_select-after">
      <div class="weui-cell__hd">
        <label for="" class="weui-label">费用选择</label>
      </div>
      <div class="weui-cell__bd">
        <select class="weui-select select-r color-grey" disabled="disabled" name="price">
           ${clear(`${price.map(key => `
           <option value="${key.Priceid}">${key.Pricename}￥${key.Price}</option>
           `)}`)}                              
        </select>
      </div>
    </div>
      <div class="weui-cell">
      <div class="weui-cell__hd"><label class="weui-label">昵称</label></div>
      <div class="weui-cell__bd">
          <input class="weui-input text-right color-grey" required emptyTips="请输入昵称" readonly="true" name="nickname" type="text" placeholder="你的昵称" value="${guest.guest_name}">
      </div>
  </div>
  <div class="weui-cell">
      <div class="weui-cell__hd"><label class="weui-label">手机</label></div>
      <div class="weui-cell__bd">
          <input class="weui-input text-right color-grey" required pattern="REG_PHONE" readonly="true" name="phone" type="tel" placeholder="请输入手机号" emptyTips="请输入手机号" notMatchTips="请输入正确的手机号" value="${guest.guest_tel}">
      </div>
  </div>`
    },
    customOpts (data) { // 自定义报名选项
      let obj = JSON.parse(data.customOpt)
      let html = ''
      let selected = JSON.parse(data.customSelect)
      this.applyItem = obj
      for (let key in obj) {
        let arr = itemtoArraytop(obj[key], obj[key].indexOf(selected[key]))
        html += `<div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd">
            <label for="" class="weui-label myopt-title">${key}</label>
        </div>
        <div class="weui-cell__bd">
            <select class="weui-select select-r color-grey" disabled="disabled" name="myopts-item" data-text='${key}'>
               ${clear(`${arr.map(item => `
               <option value="${item}">${item}</option>
              `)}`)}
            </select>
        </div>
    </div>`
      }
      return html
    },
    pageInit () {
      this._getApplyHelp()

      $('.apply-mag-lists').on('click', '.btn-cancel', (e) => {
        this.cancel(e)
      })

      $('.apply-mag-lists').on('click', '.btn-edit', (e) => {
        this.edit(e)
      })
      $('.apply-mag-lists').on('click', '.btn-confirm', (e) => {
        this._postEdit($(e.currentTarget).parents('.form-bb'))
      })
    },
    formTemp (data, i) {
      return `<form  action="" class="form-bb" name="apply-help" method="post">
      <div class="weui-cells__title">帮报名${i + 1}</div>
      <div id='guest${i}' class="weui-cells">${data}</div>
     </form>`
    },
    _getApplyHelp () {
      model.magAct.getApplyHelp({ id: getQueryString('id') }).then(data => {
        let actForm = data.actForm
        let guests = data.guest_user
        this.DATA = data
        let formTemp = ''

        for (let i = 0; i < guests.length; i++) {
          let temp = ''
          temp += this.fixTemp(data, guests[i])
          if (actForm.Formname !== '') { // 如果真实姓名有值
            temp += this.realNameTemp(guests[i])
          }
          if (actForm.Formsex !== '') { // 如果性别有值
            temp += this.sexTemp(guests[i])
          }
          if (actForm.Formsfz !== '') { // 如果身份证有值
            temp += this.idCard(guests[i])
          }
          if (actForm.Formzjx !== '') { // 如果有自定义报名项
            temp += this.customOpts(guests[i])
          }
          temp += `<div class="weui-cell">
          <div class="weui-cell__hd">
              <label for="" class="weui-label myopt-title f-m" style="color:#e02e24">报名成功</label>
          </div>
          <div class="weui-cell__bd text-right">
            <input type="hidden" name="actId" value="${getQueryString('id')}">
            <input type="hidden" name="guestId" value="${guests[i].guest_id}">
            <input type="hidden" name="customize-opts">
            <a class="btn-edit">修改资料</a>
            <a class="btn-cancel" data-id='${guests[i].guest_id}'>取消报名</a>
          </div>
        </div>`
          formTemp += this.formTemp(temp, i)
        }
        $('.apply-mag-lists').html(formTemp)
      }).catch(errMsg => {
        console.log(errMsg)
      })
    },
    reasonListTemp () { // 组列表模板
      const data = [
        '个人行程有变,参加不了',
        '不符合报名条件,主办方拒绝参加',
        '主办方变更了活动信息',
        '实际情况与活动信息不符',
        '主办方取消了活动',
        '其他原因'
      ]
      return `<div class="group-list">
        <ul>
          ${clear(`${data.map((key) => `<li class="dialog-confirm">${key}</li>`)}`)}
        </ul>
      </div>`
    },
    _postCancel (guestId) {
      let _thi = this
      require.ensure([], () => {
        require('vendor/dialog')
        $.alert.aler({
          title: '取消原因',
          content: this.reasonListTemp(),
          height: 'auto',
          blankclose: true,
          okCallback: function (elem) {
            const reason = $(elem.currentTarget).html()
            model.magAct.cancelApply({ id: getQueryString('id'), guestId: guestId, reason: reason }).then(res => {
              if (res.state === 'ok') {
                weui.alert('报名取消成功，请等待活动组织者的退款')
                _thi._getApplyHelp()
              }
            }).catch(errMsg => {
              weui.alert(errMsg)
            })
          }
        })
      }, 'aler')
    },
    _postEdit (e) {
      let keys = []
      for (let key in this.applyItem) {
        if (this.applyItem.hasOwnProperty(key)) {
          keys.push(key)
        }
      }
      for (let i = 0; i < keys.length; i++) {
        this.applyItem[keys[i]] = $($(e).find('select[name=myopts-item]')[i]).val()
      }
      $('input[name=customize-opts]').val(JSON.stringify(this.applyItem))

      model.magAct.editApply(e).then(res => {
        if (res.state === 'ok') {
          weui.alert('报名成员修改成功')
          this._getApplyHelp()
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    edit (e) { // 编辑活动
      $(e.currentTarget).addClass('btn-confirm').removeClass('btn-edit')
      $(e.currentTarget).text('确定')
      $(e.currentTarget).parents('.weui-cell').prevAll().find('input').removeClass('color-grey')
      $(e.currentTarget).parents('.weui-cell').prevAll().find('select').removeClass('color-grey')
      $(e.currentTarget).parents('.weui-cell').prevAll().find('input').removeAttr('readonly')
      $(e.currentTarget).parents('.weui-cell').prevAll().find('select').removeAttr('disabled')
    },
    cancel (e) { // 取消活动
      let refund = this.DATA.act.act_refund
      let opendate = this.DATA.act.act_opendate
      let nowdata = new Date()
      const guestId = $(e.currentTarget).attr('data-id')
      if (refund === '活动开始前均可申请退款') {
        nowdata > converToDate(opendate) ? weui.alert('活动已经开始，不能取消报名') : this._postCancel(guestId)
      } else if (refund === '不支持退款') {
        weui.alert('该活动不支持退款哦~')
      } else {
        nowdata > converToDate(refund) ? weui.alert(`活动已经过了${refund}之前退款的时间`) : this._postCancel(guestId)
      }
    }

  }
  return Home
}())

$(function () {
  all.pageInit()
})
