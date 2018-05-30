import $ from 'jquery'
import weui from 'weui.js'
import vali from 'vendor/validate'
import {getQueryString, clear} from 'common/js/dom'
import model from 'api/getIndex'
let regexp = {
  regexp: {
    PHONE: vali.mobile(),
    IDNUM: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
  }
}
let addApplyPer = {
  htmlTemp: `<input type="hidden" name="perType" val="1"><div class="weui-cell">
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
  <select class="weui-select" style="padding-left:2rem" name="sex">
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
  init () {
    $('#addPerForm').on('click', '#setAlreadyPay', (e) => {
      weui.confirm('确定设为已付款?', {
        title: '温馨提示',
        buttons: [{
          label: '取消',
          type: 'default',
          onClick: () => { console.log('no') }
        }, {
          label: '确定',
          type: 'primary',
          onClick: () => {
            $(e.currentTarget).parent().prev().find('input[name=payStatus]').val('已付款')
          }
        }]
      })
    })

    $('#cancel').on('click', () => {
      $('#addApplyPer').hide()
    })
    $('.addPer').on('click', () => {
      $('#addApplyPer').show()
    })

    $('#savePer').on('click', () => {
      let _thi = this
      weui.form.validate('#addPerForm', function (error) {
        if (!error) {
          var loading = weui.loading('提交中...')
          setTimeout(function () {
            loading.hide()
            _thi._addPerData()
            weui.toast('提交成功', 1000)
          }, 1000)
        }
      }, regexp)
    })
  },
  _addPerData () {
    model.magAct.addPer($('#addPerForm')).then(data => {
      console.log(data)
    }).catch(errMsg => {
      weui.alert(errMsg)
    })
  },
  getApplyData (data) {
    let applyInfo = data.actDetail
    let actForm = applyInfo.actForm
    let costWay
    let gData = Array.from($('.g-item'))
    if (actForm[0].Formpay === '否') {
      costWay = '其他支付方式'
    } else {
      costWay = '在线支付'
    }
    $('input[name=actId]').val(getQueryString('id'))
    $('#addPerForm .weui-cells').prepend(`
    ${this.htmlTemp}<div class="weui-cell weui-cell_select weui-cell_select-after">
    <div class="weui-cell__hd">
      <label for="" class="weui-label">费用选择</label>
    </div>
    <div class="weui-cell__bd">
      <select class="weui-select" name="price" style="padding-left:1rem">
          ${applyInfo.Price.map(key => `
          <option value="${key.Priceid}">${key.Pricename}￥${key.Price}</option>
          `)}                                      
      </select>
    </div>
  </div><div class="weui-cell">
  <div class="weui-cell__hd"><label class="weui-label">支付方式</label></div>
  <div class="weui-cell__bd">
      <input class="weui-input" type="text" name="costWay" readonly placeholder="" value="${costWay}">
  </div>
</div><div class="weui-cell">
<div class="weui-cell__hd">
  <label class="weui-label">支付状态</label>
</div>
<div class="weui-cell__bd">
  <input class="weui-input" type="text" name="payStatus" readonly placeholder="" value="未付款">
</div>
<div class="weui-cell__ft">
  <a id="setAlreadyPay" style="color:#e02e24">设为已付款</a>
</div>
</div>
<div class="line"></div>

    `)
    if (actForm[0].Formname) { // 如果真实姓名有值
      $('#addPerForm .weui-cells').append(this.realNameTemp)
    }
    if (actForm[0].Formsex) { // 如果性别有值
      $('#addPerForm .weui-cells').append(this.sexTemp)
    }
    if (actForm[0].Formsfz) { // 如果身份证有值
      $('#addPerForm .weui-cells').append(this.idCard)
    }
    if (actForm[0].Formzjx) { // 如果有自定义报名项
      let obj = JSON.parse(actForm[0].Formzjx)
      for (let key in obj) {
        $('#addPerForm .weui-cells').append(
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

    $('#addPerForm .weui-cells').append(clear(this.groupListTemp(gData)))
  },
  groupListTemp (data) {
    return `<div class="weui-cell weui-cell_select weui-cell_select-after">
    <div class="weui-cell__hd">
      <label for="" class="weui-label">分组</label>
    </div>
    <div class="weui-cell__bd">
      <select class="weui-select" name="groups" style="padding-left:1rem">${data.map(key => `
          <option value="${key.id}${key.innerText}">${key.innerText}</option>
          `)}                                      
      </select>
    </div>
  </div>`
  }
}
export {addApplyPer}
