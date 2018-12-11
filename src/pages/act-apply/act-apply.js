import './act-apply.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import weui from 'weui.js'
import model from 'api/getIndex'
import { clear, getQueryString, sliceArray, attributeCount } from 'common/js/dom'
import vali from 'vendor/validate'
let regexp = {
  regexp: {
    PHONE: vali.mobile(),
    IDNUM: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
  }
}

let all = (function () {
  let Home = {
    applyItem: {},
    INDEX: 0,
    temp: '',
    htmlTemp: `<div class="weui-cell">
    <div class="weui-cell__hd"><label class="weui-label">昵称</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input text-right" required emptyTips="请输入昵称" name="nickname" type="text" placeholder="你的昵称">
    </div>
</div>
<div class="weui-cell">
    <div class="weui-cell__hd"><label class="weui-label">手机</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input text-right" required pattern="REG_PHONE" name="phone" type="tel" placeholder="请输入手机号" emptyTips="请输入手机号" notMatchTips="请输入正确的手机号">
    </div>
</div> `,
    realNameTemp: `<div class="weui-cell">
    <div class="weui-cell__hd"><label class="weui-label">真实姓名</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input text-right" required emptyTips="请输入真实姓名" name="realName" type="text" placeholder="你的姓名">
    </div>
</div>`,
    sexTemp: `<div class="weui-cell weui-cell_select weui-cell_select-after">
    <div class="weui-cell__hd">
        <label for="" class="weui-label">性别</label>
    </div>
    <div class="weui-cell__bd">
        <select class="weui-select select-r" name="sex">
            <option value="男">男</option>
            <option value="女">女</option>
        </select>
    </div>
    </div>`,
    idCard: `<div  class="weui-cell">
    <div class="weui-cell__hd"><label class="weui-label">身份证</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input text-right" required pattern="REG_IDNUM" name="idCard" type="text" placeholder="请输入身份证号码" emptyTips="请输入身份证号码" notMatchTips="请输入正确的身份证号码">
    </div>
</div>`,
    pageInit () {
      this._getApplyData()
      $('#actApply').on('click', '.btn-bb-apply', () => {
        this.helpApply()
      })
      this.deleteApply()

      $('.btn-apply-comfirm').click((e) => {
        let _thi = this
        let keys = []
        let elem = []
        let len = $('select[name=myopts-item]').length// 选项总个数
        for (let key in this.applyItem) {
          if (this.applyItem.hasOwnProperty(key)) {
            keys.push(key)
          }
        }
        let group = len / keys.length // 这里写的那么复杂解决的是每个帮报能获取各自的自定义填写项的值，你娃肯定写不出来
        elem = sliceArray(Array.from($('select[name=myopts-item]')), keys.length)

        for (let j = 0; j < group; j++) {
          for (let i = 0; i < keys.length; i++) {
            this.applyItem[keys[i]] = $(elem[j][i]).val()//
          }
          $($('input[name=customize-opts]')[j]).val(JSON.stringify(this.applyItem))
        }

        weui.form.validate('#actApply', function (error) {
          if (!error) {
            var loading = weui.loading('提交中...')
            setTimeout(() => {
              loading.hide()
              _thi._postApplyData()
            }, 1000)
          }
        }, regexp)
      })
    },

    helpApply () { // 帮人报名
      this.INDEX = $('#actApply .help-apply').length + 1
      $('.btn-bb-apply').before(`
          <div id="help${this.INDEX}" class="help-apply">
            <input type="hidden" name="perType" value="1">
            <div class="weui-cells__title">帮报名${this.INDEX}</div>
            <div class="weui-cells"></div>
          </div>
        `)
      $(`#help${this.INDEX}`).find('.weui-cells').append(clear(this.temp))
    },
    deleteApply () { // 删除报名
      $('#actApply').on('click', '.delete-apply', (e) => {
        $(e.currentTarget).parents('.help-apply').remove()
        let len = $('#actApply .help-apply').length
        for (let i = 0; i < len; i++) {
          $($('.help-apply')[i]).attr('id', `help${i + 1}`)
          $($('.help-apply')[i]).find('.weui-cells__title').html(`帮报名${i + 1}`)
        }
      })
    },
    _getPerApplyData () { // 获取用户填写的信息
      let _thi = this
      model.getPerApplyData({ orderId: getQueryString('orderId') }).then(data => {
        let len = data.users.length
        for (let i = 0; i < len; i++) {
          if (i < len - 1) {
            _thi.helpApply()
          }
          $($('select[name=price]')[i]).val(data.users[i].user_price_selectid)
          $($('input[name=nickname]')[i]).val(data.users[i].user_nice)
          $($('input[name=phone]')[i]).val(data.users[i].user_phone)
          if (data.users[i].user_realname !== '') {
            $($('input[name=realName]')[i]).val(data.users[i].user_realname)
          }
          if (data.users[i].user_sex !== '') {
            $($('select[name=sex]')[i]).val(data.users[i].user_sex)
          }
          if (data.users[i].user_idcard !== '') {
            $($('input[name=idCard]')[i]).val(data.users[i].user_idcard)
          }
          if (data.users[i].user_opt !== '') {
            let selectVal = JSON.parse(data.users[i].user_select)
            let len = attributeCount(selectVal)

            for (let j = 0; j < len; j++) { // 遍历对象属性名
              let key = $($($('.customize-opt')[i]).find('select[name=myopts-item]')[j]).data('text')
              $($($('.customize-opt')[i]).find('select[name=myopts-item]')[j]).val(selectVal[key])
            }
          }
        }
        console.log(data)
      }).catch(errMsg => {
        console.log(errMsg)
      })
    },
    _getApplyData () {
      model.getApplyData({ id: getQueryString('id') }).then((data) => {
        let applyInfo = data.actDetail
        let actForm = applyInfo.actForm
        if (applyInfo.actbbm === '是') {
          $('.main-apply').after(`<div class="btn-bb-apply">
          <i class="iconfont icon-add"></i>
          <span class="f-l">帮人报名</span>
      </div>`)
        }
        $('input[name=actId]').val(getQueryString('id'))
        $('input[name=clubId]').val(getQueryString('clubId'))
        $('.main-apply .weui-cells').prepend(
          `<div class="weui-cell weui-cell_select weui-cell_select-after">
            <div class="weui-cell__hd">
              <label for="" class="weui-label">费用选择</label>
            </div>
            <div class="weui-cell__bd">
              <select class="weui-select select-r" name="price">
                 ${clear(`${applyInfo.Price.map(key => `
                 <option value="${key.Priceid}">${key.Pricename}￥${key.Price}</option>
                 `)}`)}                              
              </select>
            </div>
          </div>`
        )
        this.temp += `<div class="weui-cell weui-cell_select weui-cell_select-after">
          <div class="weui-cell__hd">
            <label for="" class="weui-label">费用</label>
          </div>
          <div class="weui-cell__bd">
            <select class="weui-select select-r" name="price">
                ${applyInfo.Price.map(key => `
                <option value="${key.Priceid}">${key.Pricename}￥${key.Price}</option>
                `)}                                      
            </select>
          </div>
        </div>${this.htmlTemp}`

        if (actForm[0].Formname) { // 如果真实姓名有值
          $('#actApply .weui-cells').append(this.realNameTemp)
          this.temp += this.realNameTemp
        }
        if (actForm[0].Formsex) { // 如果性别有值
          $('#actApply .weui-cells').append(this.sexTemp)
          this.temp += this.sexTemp
        }
        if (actForm[0].Formsfz) { // 如果身份证有值
          $('#actApply .weui-cells').append(this.idCard)
          this.temp += this.idCard
        }

        if (actForm[0].Formzjx) { // 如果有自定义报名项
          let obj = JSON.parse(actForm[0].Formzjx)
          this.applyItem = obj
          let html = ''
          for (let key in obj) {
            html += `<div class="weui-cell weui-cell_select weui-cell_select-after">
            <div class="weui-cell__hd">
                <label for="" class="weui-label myopt-title">${key}</label>
            </div>
            <div class="weui-cell__bd">
                <select class="weui-select select-r" name="myopts-item" data-text='${key}'>
                   ${clear(`${obj[key].map(item => `
                   <option value="${item}">${item}</option>
                  `)}`)}
                </select>
            </div>
        </div>`
          }
          this.temp += `<div class="customize-opt">
          <input name="customize-opts" type="hidden">
          ${html}<div class="weui-cell">
          <div class="weui-cell__hd">
              <label for="" class="weui-label myopt-title"></label>
          </div>
          <div class="weui-cell__bd text-right">
            <button class="delete-apply" type="btn">删除报名</button>
          </div>
        </div>`
          $('#actApply .weui-cells').append(
            `<div class="customize-opt">
            <input name="customize-opts" type="hidden">
            ${html}
          </div>`
          )
        } else {
          this.temp += `<div class="weui-cell">
          <div class="weui-cell__hd">
              <label for="" class="weui-label myopt-title"></label>
          </div>
          <div class="weui-cell__bd text-right">
            <button class="delete-apply" type="btn">删除报名</button>
          </div>
        </div>`
        }
      }).then(() => {
        if (getQueryString('orderId') !== null) { // 如果是编辑模式
          this._getPerApplyData()// 获取用户填写的数据
          $('input[name=orderId]').val(getQueryString('orderId'))
        }
      }).catch((errMsg) => {
        weui.alert(errMsg)
      })
    },
    _postApplyData () { // 提交报名
      model.postApplyInfo($('#actApply')).then(res => {
        if (res.state === 'ok') {
          window.location.href = `act-pay.html?id=${getQueryString('id')}&clubId=${getQueryString('clubId')}&orderId=${res.order_id}`
        }
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
