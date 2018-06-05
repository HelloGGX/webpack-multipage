import $ from 'jquery'
import weui from 'weui.js'
import vali from 'vendor/validate'
import {getQueryString, clear} from 'common/js/dom'
import model from 'api/getIndex'

// import {batchG} from '../batchGroup/batch-group'
let regexp = {
  regexp: {
    PHONE: vali.mobile(),
    IDNUM: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
  }
}
let addApplyPer = {

  realNameTemp: `<div class="weui-cell">
<div class="weui-cell__hd"><label class="weui-label">真实姓名</label></div>
<div class="weui-cell__bd">
  <input class="weui-input" required emptyTips="请输入真实姓名" name="realName" type="text" placeholder="你的姓名">
</div>
</div>`,
  sexTemp: `<div class="weui-cell weui-cell_select weui-cell_select-after">
<div class="weui-cell__hd">
  <label for="" class="weui-label">性别</label>
</div>
<div class="weui-cell__bd">
  <select class="weui-select"  name="sex">
      <option value="男">男</option>
      <option value="女">女</option>
  </select>
</div>
</div>`,
  idCard: `<div  class="weui-cell">
<div class="weui-cell__hd"><label class="weui-label">身份证</label></div>
<div class="weui-cell__bd">
  <input class="weui-input" required pattern="REG_IDNUM" name="idCard" type="text" placeholder="请输入身份证号码" emptyTips="请输入身份证号码" notMatchTips="请输入正确的身份证号码">
</div>
</div>`,
  hide () {
    $('#addApplyPer').hide()
  },
  show () {
    $('#addApplyPer').show()
  },
  init (initData) {
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
      this.hide()
    })
    $('.addPer').on('click', () => {
      let _thi = this
      this.show()
      model.getMagInfo({id: getQueryString('id')}).then(args => {
        _thi.getApplyData(args[1])// 获取报名填写项信息
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    })

    $('#savePer').on('click', () => {
      let _thi = this
      // let groupId = $('select[name=groups] option:selected').data('id')
      weui.form.validate('#addPerForm', function (error) {
        if (!error) {
          var loading = weui.loading('提交中...')
          setTimeout(function () {
            loading.hide()
            _thi._addPerData(initData)
            weui.toast('提交成功', 1000)
          }, 1000)
        }
      }, regexp)
    })
  },
  _addPerData (initData) {
    let _thi = this
    model.magAct.addPer($('#addPerForm')).then(res => {
      if (res.state === 'ok') {
        _thi.hide()
        weui.alert('添加报名成员成功')
        initData()
      }
    }).catch(errMsg => {
      weui.alert(errMsg)
    })
  },
  getApplyData (data) {
    let applyInfo = data.actDetail
    let actForm = applyInfo.actForm
    let costWay = []
    let gData = Array.from($('.g-item'))
    if (actForm[0].Formpay === '是') {
      costWay.push('微信支付')
    }
    if (actForm[0].Formqtpay === '是') {
      costWay.push('其他支付方式')
    }
    let htmlTemp = `<input type="hidden" name="perType" val="1"><div class="weui-cell">
    <div class="weui-cell__hd"><label class="weui-label">昵称</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input" required emptyTips="请输入昵称" name="nickname" type="text" placeholder="你的昵称">
    </div>
  </div>
  <div class="weui-cell">
    <div class="weui-cell__hd"><label class="weui-label">手机</label></div>
    <div class="weui-cell__bd">
        <input class="weui-input" required pattern="REG_PHONE" name="phone" type="tel" placeholder="请输入手机号" emptyTips="请输入手机号" notMatchTips="请输入正确的手机号">
    </div>
  </div> `
    htmlTemp += `<div class="weui-cell weui-cell_select weui-cell_select-after">
    <div class="weui-cell__hd">
      <label for="" class="weui-label">费用选择</label>
    </div>
    <div class="weui-cell__bd">
      <select class="weui-select" name="price">
          ${applyInfo.Price.map(key => `
          <option value="${key.Priceid}">${key.Pricename}￥${key.Price}</option>
          `)}                                      
      </select>
    </div>
  </div><div class="weui-cell">
  <div class="weui-cell__hd"><label class="weui-label">支付方式</label></div>
  <div class="weui-cell__bd">
      <input class="weui-input" type="text" name="costWay" readonly placeholder="" value="${costWay.join(',')}">
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
<div class="line"></div>`
    $('input[name=actId]').val(getQueryString('id'))

    if (actForm[0].Formname) { // 如果真实姓名有值
      htmlTemp += this.realNameTemp
    }
    if (actForm[0].Formsex) { // 如果性别有值
      htmlTemp += this.sexTemp
    }
    if (actForm[0].Formsfz) { // 如果身份证有值
      htmlTemp += this.idCard
    }
    if (actForm[0].Formzjx) { // 如果有自定义报名项
      let obj = JSON.parse(actForm[0].Formzjx)
      let zjxtem = ''
      for (let key in obj) {
        zjxtem = `<div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd">
            <label for="" class="weui-label myopt-title">${key}</label>
        </div>
        <div class="weui-cell__bd">
            <select class="weui-select" name="myopts-item">
               ${obj[key].map(item => `
                <option value="${item}">${item}</option>
               `)}
            </select>
        </div>
    </div>`
      }
      htmlTemp += zjxtem
    }
    if ($('.g-lists .g-item').length > 0) { // 如果有分组
      htmlTemp += clear(this.groupListTemp(gData))
    }
    $('#addPerForm .weui-cells').html(htmlTemp)
  },
  groupListTemp (data) {
    return `<div class="weui-cell weui-cell_select weui-cell_select-after">
    <div class="weui-cell__hd">
      <label for="" class="weui-label">分组</label>
    </div>
    <div class="weui-cell__bd">
      <select class="weui-select" name="groups">
        <option value="0">未分组</option>
        ${data.map(key => `
          <option data-id="${key.id}" value="${key.id}">${key.innerText}</option>
          `)}                                      
      </select>
    </div>
  </div>`
  }
}
export {addApplyPer}
