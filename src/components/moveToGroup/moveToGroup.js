import model from 'api/getIndex'
import $ from 'jquery'
import weui from 'weui.js'
import {getQueryString, Trim, clear} from 'common/js/dom'
import {batchG} from 'pages/batchGroup/batch-group'

class MoveToGroup {
  // targetelem代表选中的目标元素
  // perIdArr代表选中的游客id所组成的数组
  // okCallBack 代表移动到组成功后的回调函数
  constructor ({perIdArr = [], okCallBack = () => {}} = {}) {
    this.perIdArr = perIdArr
    this.okCallBack = okCallBack
  }
  init () {
    this.showGroup()
  }
  _groupTemp (arr) { // 组模板
    if (arr !== null) {
      return `${arr.map(key => `
      <div id="${key.group_id}" class="weui-cell weui-cell_access g-item" style="padding: 6px 15px;">
          <div class="weui-cell__hd g-img"><i class="icon iconfont icon-group_fill" style="font-size:26px;color: #e02e24;"></i></div>
            <div class="weui-cell__bd g-name">
              <p>${key.group_name}<span>(${key.group_guest !== null ? key.group_guest.length : 0}人)</span></p>
            </div>
          <div class="weui-cell__ft"></div>
       </div>`)}`
    } else {
      return ''
    }
  }
  _unclassItemTemp (data) { // 未分组人员模板
    if (data !== null) {
      let mainPer = data[0].guest_name
      return ` ${data.map(key => `
      <div class="unclass-item">
        <div class="weui-cell unclass-item-top">
            <div class="weui-cell__hd per-head"><img src=${require(`../../imgs/icons/${key.guest_sex === '男' ? 'boy' : 'girl'}.jpg`)} alt=""></div>
              <div class="weui-cell__bd">
                  <p class="f-m per-name">${key.guest_name}</p>
                  <p class="f-s per-bbname">${key.guest_type === '0' ? `发起人` : `${mainPer}帮报`}</p>
              </div>
              <div class="weui-cell__ft">
              <p class="per-apply-cost">${key.guest_pricecl} ￥${key.guest_price}</p>
              <p class="per-pay-way">${key.guest_wxpay === '是' ? '微信支付' : ''}  ${key.guest_qtpay === '是' ? '其他支付方式' : ''}${key.guest_paystate === '1' ? `(已付款)` : `(未付款)`}</p>
              </div>      
            </div>
            <div class="moreInfo show" style="display:none">
              <div class="moreInfo-top">
                <p>${key.guest_sex}</p>
                <p>${key.guest_tel}</p>
              </div>
              <div class="moreInfo-dowm">
                <a class="txt-green" href="">短信</a>
                <a class="txt-green" href="">电话</a>
                <a class="txt-green" href="">编辑</a>
                <a class="text-red btn-audit" data-id="${key.guest_id}">分组</a>
              </div>
            </div>
          </div>
      `)}`
    } else {
      return ''
    }
  }
  _getGroups (arr) { // 获取分组信息
    $('.g-lists').html(clear(this._groupTemp(arr)))
  }
  _getUnClassPer (data) { // 获取未分组人员信息
    $('.unclass-lists').html(clear(this._unclassItemTemp(data)))
  }
  _getActInfoData (data) {
    let group = data.group// 获取组信息
    let guest = data.guest// 获取游客信息
    this._getGroups(group)
    this._getUnClassPer(guest)// 在活动管理页面获取未分组游客信息
    batchG.batchGetUnclassPer(guest)// 这里是批量分组里面获取未分组游客信息
  }
  _initActData () { // 刷新重新初始化数据
    model.getActDetailData({id: getQueryString('id')}).then(data => {
      this._getActInfoData(data)// 获取活动详细信息
    }).catch(errMsg => {
      weui.alert(errMsg)
    })
  }
  groupListTemp (data, len) { // 组列表模板
    return `<div class="group-list">
      <ul>
        ${data.map((key) => `<li class="dialog-confirm" data-id="0">未分组(${len})</li><li class="dialog-confirm" data-id="${key.id}">${key.innerText}</li>`)}
      </ul>
    </div>`
  }
  showGroup () { // 显示有哪些分组
    let gData = Array.from($('.g-item'))
    let len = $('.unclass-item').length
    let _thi = this
    require.ensure([], () => {
      require('vendor/dialog')
      $.alert.aler({
        title: '温馨提示',
        content: clear(this.groupListTemp(gData, len)),
        height: 'auto',
        blankclose: true,
        okCallback: function (e) {
          _thi._moveToGroupData(e)
        }
      })
    }, 'aler')
  }
  _moveToGroupData (e) { // 移动到已有分组
    let _thi = this
    let groupName = Trim($(e.currentTarget).html(), 'g').match(/[\u4e00-\u9fa5_a-zA-Z0-9]+(?=\()/g)[0]
    let groupId = $(e.currentTarget).data('id')
    // let perId =

    model.magAct.moveToGroup({id: getQueryString('id'), groupId: groupId, groupName: groupName, perId: this.perIdArr}).then(res => {
      if (res.state === 'ok') {
        weui.alert('移动到分组成功')
        _thi._initActData()// 刷新初始化数据
        _thi.okCallBack()
      }
    }).catch(errMsg => {
      console.log(errMsg)
    })
  }
}

export function moveToGroup (opt) {
  return new MoveToGroup({
    perIdArr: opt.perIdArr,
    okCallBack: opt.okCallBack
  })
}
