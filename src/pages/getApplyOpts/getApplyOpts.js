import model from 'api/getIndex'
import $ from 'jquery'
import weui from 'weui.js'
import vali from 'vendor/validate'
import {getQueryString, clear, itemtoArraytop} from 'common/js/dom'
import {showGroupPer} from '../showGroupPer/show-g-per'
let regexp = {
  regexp: {
    PHONE: vali.mobile(),
    IDNUM: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
  }
}
let editApply = {
  applyItem: {},
  htmlTemp (data) {
    return `<input type="hidden" name="perType" value="${data.guest_type}">
    <input type="hidden" name="perId" value="${data.guest_id}">
    <input type="hidden" name="groupId" value="${data.groupid}">
    <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">昵称</label></div>
        <div class="weui-cell__bd">
            <input class="weui-input" required emptyTips="请输入昵称" name="nickname" type="text" placeholder="你的昵称" value="${data.nickName}">
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">手机</label></div>
        <div class="weui-cell__bd">
            <input class="weui-input" required pattern="REG_PHONE" name="phone" type="tel" placeholder="请输入手机号" emptyTips="请输入手机号" notMatchTips="请输入正确的手机号" value="${data.phone}">
        </div>
      </div>`
  },
  realNameTemp (data) {
    return `<div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">真实姓名</label></div>
        <div class="weui-cell__bd">
          <input class="weui-input" required emptyTips="请输入真实姓名" name="realName" type="text" placeholder="你的姓名" value="${data.realName}">
        </div>
        </div>`
  },
  sexTemp (data) {
    let sexData = ['男', '女']
    let sexArray = itemtoArraytop(sexData, sexData.indexOf(data.sex))
    return `<div class="weui-cell weui-cell_select weui-cell_select-after">
        <div class="weui-cell__hd">
          <label for="" class="weui-label">性别</label>
        </div>
        <div class="weui-cell__bd">
          <select class="weui-select"  name="sex" value="${data.sex}">
              ${clear(`${sexArray.map(item => `
              <option value="${item}">${item}</option>
              `)}`)}
          </select>
        </div>
        </div>`
  },
  idCard (data) {
    return `<div  class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">身份证</label></div>
        <div class="weui-cell__bd">
          <input class="weui-input" value="${data.idcard}" required pattern="REG_IDNUM" name="idCard" type="text" placeholder="请输入身份证号码" emptyTips="请输入身份证号码" notMatchTips="请输入正确的身份证号码">
        </div>
        </div>`
  },
  init (initData) {
    $('#editApplyForm').on('click', '#editSetAlreadyPay', (e) => {
      if ($(e.currentTarget).parent().prev().find('input[name=payStatus]').val() === '已付款') {
        weui.confirm('确定设为未付款?', {
          title: '温馨提示',
          buttons: [{
            label: '取消',
            type: 'default',
            onClick: () => { console.log('no') }
          }, {
            label: '确定',
            type: 'primary',
            onClick: () => {
              $(e.currentTarget).parent().prev().find('input[name=payStatus]').val('未付款')
              $(e.currentTarget).text('设为已付款')
            }
          }]
        })
      } else {
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
              $(e.currentTarget).text('设为未付款')
            }
          }]
        })
      }
    })
    $('body').on('click', '.btn-edit', (e) => {
      this._getPerApply(e)
      this.show()
    })
    $('#editApplyCancel').on('click', (e) => {
      this.hide()
    })
    $('#saveEdit').on('click', () => {
      let _thi = this
      // let len = $('select[name=myopts-item]').length
      let keys = []
      for (let key in this.applyItem) {
        if (this.applyItem.hasOwnProperty(key)) {
          keys.push(key)
        }
      }
      for (let i = 0; i < keys.length; i++) {
        this.applyItem[keys[i]] = $($('select[name=myopts-item]')[i]).val()
      }
      $('input[name=customize-opts]').val(JSON.stringify(this.applyItem))
      weui.form.validate('#editApplyForm', function (error) {
        if (!error) {
          var loading = weui.loading('提交中...')
          setTimeout(function () {
            loading.hide()
            _thi._editPerData(initData)
            weui.toast('提交成功', 1000)
          }, 1000)
        }
      }, regexp)
    })
  },
  _editPerData (initData) {
    let _thi = this
    model.magAct.editPer($('#editApplyForm')).then(res => {
      if (res.state === 'ok') {
        _thi.hide()
        weui.alert('修改报名成员信息成功')
        initData()
        showGroupPer.showGroupPer($('input[name=groupId]').val())
      }
    }).catch(errMsg => {
      weui.alert(errMsg)
    })
  },
  show () {
    $('#editPerApplyOpt').show()
  },
  hide () {
    $('#editPerApplyOpt').hide()
  },
  _getPerApply (e) {
    let _thi = this
    let id = $(e.currentTarget).next().data('id')
    model.magAct.getPerApplyOpt({guest_id: id}).then(data => {
      _thi.getApplyData(data)
    }).catch(errMsg => {
      weui.alert(errMsg)
    })
  },
  getApplyData (data) {
    let costWay = []

    let price = data.payOpts
    if (data.wxpay === '是') {
      costWay.push('微信支付')
    }

    if (data.qtpaycl === '是') {
      costWay.push('其他支付方式')
    }

    if (data.wxpay === '否' && data.qtpaycl === '否') {
      costWay.push('免费')
    }

    let onlyTemp = this.htmlTemp(data)

    let selectItem = price.find(item => item.priceid === Number(data.payOptsSelectid))

    let priceArr = itemtoArraytop(price, price.indexOf(selectItem))

    price = priceArr

    onlyTemp += `<div class="weui-cell weui-cell_select weui-cell_select-after">
    <div class="weui-cell__hd">
      <label for="" class="weui-label">费用选择</label>
    </div>
    <div class="weui-cell__bd">
      <select class="weui-select" name="price">
          ${clear(`${price.map(key => `
          <option value="${key.priceid}">${key.pricename}￥${key.price}</option>
          `)}`)}                            
      </select>
    </div>
  </div><div class="weui-cell">
  <div class="weui-cell__hd"><label class="weui-label">支付方式</label></div>
  <div class="weui-cell__bd">
      <input class="weui-input" type="text" name="costWay" readonly  value="${costWay.join(',')}">
  </div>
</div><div class="weui-cell">
<div class="weui-cell__hd">
  <label class="weui-label">支付状态</label>
</div>
<div class="weui-cell__bd">
  <input class="weui-input" type="text" name="payStatus" readonly  value="${data.paystate === '0' ? '未付款' : '已付款'}">
</div>
<div class="weui-cell__ft">
  <a id="editSetAlreadyPay" style="color:#e02e24">${data.paystate === '0' ? '设为已付款' : '设为未付款'}</a>
</div>
</div>
<div class="line"></div>`

    $('input[name=editActId]').val(getQueryString('id'))
    if (data.realName !== '') { // 如果真实姓名有值
      onlyTemp += this.realNameTemp(data)
    }
    if (data.sex !== '') { // 如果性别有值
      onlyTemp += this.sexTemp(data)
    }
    if (data.idcard !== '') { // 如果身份证有值
      onlyTemp += this.idCard(data)
    }

    if (data.customOpt !== '') { // 如果有自定义报名项
      let zjxtem = ''
      let obj = JSON.parse(data.customOpt)
      let customSelect = JSON.parse(data.customSelect)
      this.applyItem = obj

      for (let key in obj) {
        let arr = itemtoArraytop(obj[key], obj[key].indexOf(customSelect[key]))
        obj[key] = arr

        zjxtem += `<div class="weui-cell weui-cell_select weui-cell_select-after">
        
        <div class="weui-cell__hd">
            <label for="" class="weui-label myopt-title">${key}</label>
        </div>
        <div class="weui-cell__bd">
            <select class="weui-select" name="myopts-item">
               ${clear(`${obj[key].map(item => `
               <option value="${item}">${item}</option>
              `)}`)}
            </select>
        </div>
    </div>`
      }

      onlyTemp += `<div class="customize-opt"><input type="hidden" name="myopts">${zjxtem}</div>`
    }
    if (data.groupName !== '') { // 如果该用户有分组
      onlyTemp += clear(this.groupListTemp(data))
    }
    $('#editApplyForm .weui-cells').html(onlyTemp)

    if ($('select[name=myopts-item]').length > 0) {
      $('input[name=myopts]').val(data.customSelect)
      $('select[name=myopts-item]').on('change', (e) => {
        let dataname = $(e.currentTarget).val()
        let key = $(e.currentTarget).parent().prev().find('label').html()
        let customSelect = JSON.parse(data.customSelect)
        customSelect[key] = dataname
        $('input[name=myopts]').val(JSON.stringify(customSelect))
      })
    }
  },
  groupListTemp (data) {
    return `<div class="weui-cell weui-cell_select weui-cell_select-after">
    <div class="weui-cell__hd">
      <label for="" class="weui-label">分组</label>
    </div>
    <div class="weui-cell__bd">
      <select class="weui-select" name="groups">
          <option data-id="${data.groupid}" value="${data.groupid}">${data.groupName}</option>                                     
      </select>
    </div>
  </div>`
  }
}

export {editApply}
