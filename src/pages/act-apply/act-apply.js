import './act-apply.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'
import {getQueryString} from 'common/js/dom'

let all = (function () {
  let Home = {
    INDEX: 0,
    pageInit: function () {
      this._getApplyData()
      this.helpApply()
    },
    helpApply () { // 帮人报名
      let optionHtml = $('.main-apply').find('.weui-cells').html()
      $('.btn-bb-apply').on('click', (e) => {
        this.INDEX++
        $(e.currentTarget).before(`
          <div id="help${this.INDEX}" class="help-apply">
            <div class="weui-cells__title">帮报名${this.INDEX}</div>
            <div class="weui-cells"></div>
          </div>
        `)
        $(`#help${this.INDEX}`).find('.weui-cells').append(optionHtml)
      })
    },
    _getApplyData: function () {
      model.getApplyData({id: getQueryString('id'), clubId: getQueryString('clubId')}).then((data) => {
        console.log(data)
        let applyInfo = data.actDetail
        let actForm = applyInfo.actForm
        $('select[name=price]').html(
          applyInfo.Price.map(key => `
          <option value="${key.Pricename}￥${key.Price}">${key.Pricename}￥${key.Price}</option>
          `)
        )
        if (actForm[0].Formname) { // 如果真实姓名有值
          $('#actApply .weui-cells').append(`<div class="weui-cell">
         <div class="weui-cell__hd"><label class="weui-label">真实姓名</label></div>
         <div class="weui-cell__bd">
             <input class="weui-input text-right" name="realName" type="text" placeholder="你的姓名">
         </div>
     </div>`)
        }

        if (actForm[0].Formsex) { // 如果性别有值
          $('#actApply .weui-cells').append(
            `<div class="weui-cell weui-cell_select weui-cell_select-after">
<div class="weui-cell__hd">
    <label for="" class="weui-label">性别</label>
</div>
<div class="weui-cell__bd">
    <select class="weui-select" style="padding-left:2.1rem" name="sex">
        <option value="男">男</option>
        <option value="女">女</option>
    </select>
</div>
</div>`)
        }

        if (actForm[0].Formsfz) { // 如果身份证有值
          $('#actApply .weui-cells').append(`
          <div  class="weui-cell">
          <div class="weui-cell__hd"><label class="weui-label">身份证</label></div>
          <div class="weui-cell__bd">
              <input class="weui-input text-right" name="idCard" type="number" placeholder="请输入身份证号码">
          </div>
      </div>
          `)
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
