import './act-apply.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'
import {clear, getQueryString} from 'common/js/dom'

let all = (function () {
  let Home = {
    INDEX: 0,
    temp: `<input type="hidden" name="perType" val="1">`,
    htmlTemp: `<div class="weui-cell">
    <div class="weui-cell__hd"><label class="weui-label">昵称</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input text-right" name="nickname" type="text" placeholder="你的昵称">
    </div>
</div>
<div class="weui-cell">
    <div class="weui-cell__hd"><label class="weui-label">手机</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input text-right" name="phone" type="number" placeholder="请输入手机号">
    </div>
</div> `,
    realNameTemp: `<div class="weui-cell">
    <div class="weui-cell__hd"><label class="weui-label">真实姓名</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input text-right" name="realName" type="text" placeholder="你的姓名">
    </div>
</div>`,
    sexTemp: `<div class="weui-cell weui-cell_select weui-cell_select-after">
    <div class="weui-cell__hd">
        <label for="" class="weui-label">性别</label>
    </div>
    <div class="weui-cell__bd">
        <select class="weui-select" style="padding-left:2.1rem" name="sex">
            <option value="男">男</option>
            <option value="女">女</option>
        </select>
    </div>
    </div>`,
    idCard: `<div  class="weui-cell">
    <div class="weui-cell__hd"><label class="weui-label">身份证</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input text-right" name="idCard" type="number" placeholder="请输入身份证号码">
    </div>
</div>`,
    pageInit: function () {
      this._getApplyData()
      this.helpApply()
      this.deleteApply()
    },
    helpApply () { // 帮人报名
      $('.btn-bb-apply').on('click', (e) => {
        this.INDEX = $('#actApply .help-apply').length + 1
        $(e.currentTarget).before(`
          <div id="help${this.INDEX}" class="help-apply">
            <div class="weui-cells__title">帮报名${this.INDEX}</div>
            <div class="weui-cells"></div>
          </div>
        `)
        $(`#help${this.INDEX}`).find('.weui-cells').append(clear(this.temp))
      })
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
    _getApplyData () {
      model.getApplyData({id: getQueryString('id'), clubId: getQueryString('clubId')}).then((data) => {
        let applyInfo = data.actDetail
        let actForm = applyInfo.actForm

        $('.main-apply .weui-cells').prepend(`
          <div class="weui-cell weui-cell_select weui-cell_select-after">
            <div class="weui-cell__hd">
              <label for="" class="weui-label">费用</label>
            </div>
            <div class="weui-cell__bd">
              <select class="weui-select" name="price" style="padding-left:1.6rem">
                  ${applyInfo.Price.map(key => `
                  <option value="${key.Pricename}￥${key.Price}">${key.Pricename}￥${key.Price}</option>
                  `)}                                      
              </select>
            </div>
          </div>
        `)
        this.temp += `<div class="weui-cell weui-cell_select weui-cell_select-after">
          <div class="weui-cell__hd">
            <label for="" class="weui-label">费用</label>
          </div>
          <div class="weui-cell__bd">
            <select class="weui-select" name="price" style="padding-left:1.6rem">
                ${applyInfo.Price.map(key => `
                <option value="${key.Pricename}￥${key.Price}">${key.Pricename}￥${key.Price}</option>
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
          for (let key in obj) {
            $('#actApply .weui-cells').append(
              `<div class="weui-cell weui-cell_select weui-cell_select-after">
              <div class="weui-cell__hd">
                  <label for="" class="weui-label myopt-title">${key}</label>
              </div>
              <div class="weui-cell__bd">
                  <select class="weui-select" style="padding-left:1.6rem" name="myopts-item">
                     ${obj[key].map(item => `
                      <option value="${item}">${item}</option>
                     `)}
                  </select>
              </div>
          </div>`
            )
            this.temp += `<div class="weui-cell weui-cell_select weui-cell_select-after">
            <div class="weui-cell__hd">
                <label for="" class="weui-label myopt-title">${key}</label>
            </div>
            <div class="weui-cell__bd">
                <select class="weui-select" style="padding-left:1.6rem" name="myopts-item">
                   ${obj[key].map(item => `
                    <option value="${item}">${item}</option>
                   `)}
                </select>
            </div>
        </div><div class="weui-cell">
        <div class="weui-cell__hd">
            <label for="" class="weui-label myopt-title"></label>
        </div>
        <div class="weui-cell__bd text-right">
          <button class="delete-apply" type="btn">删除报名</button>
        </div>
    </div>`
          }
        }
      }).catch((errMess) => {

      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
