/* jshint esversion: 6 */
import './act-info-mag.less'
import 'components/banner/banner.less'
import 'components/tabs/tabs.less'
import $ from 'jquery'
import weui from 'weui.js'
// import {pickerAddr, pickerData} from 'components/picker/picker' // 引入地区和日期选择对象方法
import {batchG} from '../batchGroup/batch-group'
import {addApplyPer} from '../addApplyPerson/add-apply-per'
import {showGroupPer} from '../showGroupPer/show-g-per'
import {editApply} from '../getApplyOpts/getApplyOpts'
import model from 'api/getIndex'
import {getQueryString, clear} from 'common/js/dom'
import {moveToGroup} from 'components/moveToGroup/moveToGroup'
import {batchReview} from '../reviewGroup/review-g'

let all = (function () {
  let search = {// 搜索框显示及查询

    init () {
      $('body').on('click', '.cancel-search', () => {
        this.hide()
      })

      $('body').on('click', '.searchbar', () => {
        this.show()
      })
      this.searchange()

      $('body').on('click', '.search', () => {
        var inputVal = $('#view-input').val().trim()
        // alert(inputVal)
        this.searchVal(inputVal)
      })

      $('body').on('click', '.recent-history-list', (e) => {
        var val = $(e.currentTarget).html().trim()
        this.searchVal(val)
      })
      $('.search-recent-list-view .recent-history-list').on('click', (e) => {
        var val = $(e.currentTarget).html().trim()
        this.searchVal(val)
      })
      $('.btn-reset').on('click', () => {
        $('#view-input').val('')
        $('.cancel-button-view').removeClass('search')
        $('.cancel-button-view').addClass('cancel-search')
        $('.cancel-button-view').html('返回')
        $('.btn-reset').hide()
      })
    },
    show () {
      $('.search-view-container').css('visibility', 'visible')
      $('.search-view-container').css('display', 'block')
    },
    hide () {
      $('.search-view-container').css('visibility', 'hidden')
      $('.search-view-container').css('display', 'none')
    },
    searchange () {
      $('#view-input').bind('input propertychange', (e) => {
        var newval = $(e.currentTarget).val()
        if (newval.length > 0) {
          $('.cancel-button-view').addClass('search')
          $('.cancel-button-view').removeClass('cancel-search')
          $('.cancel-button-view').html('搜索')
          $('.btn-reset').show()
        } else {
          $('.cancel-button-view').removeClass('search')
          $('.cancel-button-view').addClass('cancel-search')
          $('.cancel-button-view').html('返回')
          $('.btn-reset').hide()
        }
      })
    },
    searchVal (val) {

    }
  }
  //   let textAreaTemp = `<div class="weui-cells weui-cells_form margin">
  //   <div class="weui-cell">
  //       <div class="weui-cell__bd">
  //           <textarea name="theme" class="weui-textarea" style="height: 1.4rem;" maxlength="100" placeholder="请输入活动主题" rows="3"></textarea>
  //           <div class="weui-textarea-counter"><span>0</span>/100</div>
  //           <div class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
  //       </div>
  //   </div>
  // </div>`
  let applyMagFail = {// 已拒绝报名成员
    init () {
      $('.fail-lists').on('click', '.fail-item-top', (e) => {
        this.failItemShow(e)
      })
      $('.f-group .txt-group').on('click', (e) => {
        $(e.currentTarget).parent().next('.fail-lists').toggle()
      })
    },
    failItemShow (e) { // 未审核单个成员的显示隐藏切换
      $(e.currentTarget).next('.moreInfo').toggle()
    }
  }
  let applyMagReview = { // 审核报名成员
    init () {
      $('.unreview-lists').on('click', '.unreview-item-top', (e) => {
        this.unreviewItemShow(e)
      })
      $('.r-group .txt-group').on('click', (e) => {
        $(e.currentTarget).parent().next('.unreview-lists').toggle()
      })
      $('.unreview-lists').on('click', '.btn-review', (e) => {
        this.singleClass(e)
      })
    },
    unreviewItemShow (e) { // 未审核单个成员的显示隐藏切换
      $(e.currentTarget).next('.moreInfo').toggle()
    },
    singleClass (e) { // 单个审核
      weui.confirm('审核报名成员', {
        title: '审核报名成员',
        buttons: [{
          label: '不通过',
          type: 'default',
          onClick: function () {
            require.ensure([], () => {
              require('vendor/dialog')
              $.alert.aler({
                title: '温馨提示',
                content: batchReview.inputTemp(),
                height: 'auto',
                blankclose: true,
                okCallback: function (elem) {
                  let reason = $(elem.currentTarget).parent().prev().val()
                  if (reason === '') {
                    weui.alert('理由不能为空')
                    return false
                  } else {
                    model.magAct.reviewPer({perId: [$(e.currentTarget).data('id')], call: 'fail', reason: reason}).then(res => {
                      if (res.state === 'ok') { // 如果新建分组插入成功
                        weui.alert('操作成功')
                        Home._initActData()
                      }
                    }).catch(errMsg => {
                      console.log(errMsg)
                    })
                  }
                }
              })
            }, 'aler')
          }
        }, {
          label: '通过',
          type: 'primary',
          onClick: function () {
            model.magAct.reviewPer({perId: [$(e.currentTarget).data('id')], call: 'pass', reason: ''}).then(res => {
              if (res.state === 'ok') { // 如果新建分组插入成功
                weui.alert('操作成功')
                Home._initActData()
              }
            }).catch(errMsg => {
              console.log(errMsg)
            })
          }
        }]
      })
    }
  }
  let applyMagGroup = { // 分组报名成员

    init () {
      $('.unclass-lists').on('click', '.unclass-item-top', (e) => {
        this.unclassItemShow(e)
      })
      $('.m-group .txt-group').on('click', (e) => {
        $(e.currentTarget).parent().next('.unclass-lists').toggle()
      })
      $('.unclass-lists').on('click', '.btn-audit', (e) => {
        this.singleClass(e)
      })
    },
    unclassItemShow (e) { // 未分组单个成员的显示隐藏切换
      $(e.currentTarget).next('.moreInfo').toggle()
    },
    singleClass (e) { // 单个分组
      if ($('.g-lists .g-item').length > 0) { // 如果有分组
        moveToGroup({
          perIdArr: [$(e.currentTarget).data('id')],
          okCallBack: () => {
            Home._initActData()
          }}).init()
      } else { // 如果没有分组
        weui.confirm('请先在"批量分组"中创建分组')
      }
    }
  }
  let Home = {

    pageInit () {
      this._getData()
      this.switch()
      search.init()
      applyMagGroup.init()
      applyMagReview.init()
      applyMagFail.init()
      batchG.init(this._initActData)
      editApply.init(this._initActData)
      addApplyPer.init(this._initActData)
      showGroupPer.init(this._initActData)
      batchReview.init(this._initActData)
      // $('.actTime').on('click', (e) => {
      //   pickerData.showDate(e.currentTarget)
      // })

      $('#openApply').on('click', (e) => { // 打开关闭活动
        model.magAct.openApply({id: getQueryString('id')}).then(res => {
          if (res.state === '0') { // 如果是活动打开的
            $('#openApply').find('button').html('关闭活动')
          } else if (res.state === '1') {
            $('#openApply').find('button').html('打开活动')
          }
        }).catch(errMsg => {
          weui.alert(errMsg)
        })
      })

      $('#deleteAct').on('click', () => { // 删除活动
        weui.confirm('删除活动', {
          title: '确定要删除活动吗？',
          buttons: [{
            label: '考虑一下',
            type: 'default',
            onClick: function () { }
          }, {
            label: '心意已决',
            type: 'primary',
            onClick: function () {
              model.magAct.deleteAct(getQueryString('id')).then(res => {
                console.log(res)
                if (res.state === 'delete_ok') {
                  require.ensure([], () => {
                    require('vendor/dialog')
                    $.alert.aler({
                      title: '温馨提示',
                      content: '<p style="font-size: 16px;text-align: center;line-height: 60px;">删除成功</p>',
                      height: 120,
                      blankclose: true,
                      okCallback: function (e) {
                        window.history.go(-1)
                      }
                    })
                  }, 'aler')
                } else if (res.state === 'haspers') {
                  require.ensure([], () => {
                    require('vendor/dialog')
                    $.alert.aler({
                      title: '温馨提示',
                      content: '<p style="font-size: 16px;text-align: center;line-height: 60px;">已经有人报名，不能删除</p>',
                      height: 120,
                      blankclose: true,
                      okCallback: function (e) {
                        return false
                      }
                    })
                  }, 'aler')
                } else if (res.state === 'delete_no') {
                  require.ensure([], () => {
                    require('vendor/dialog')
                    $.alert.aler({
                      title: '温馨提示',
                      content: '<p style="font-size: 16px;text-align: center;line-height: 60px;">删除失败</p>',
                      height: 120,
                      blankclose: true,
                      okCallback: function (e) {
                        return false
                      }
                    })
                  }, 'aler')
                }
              }).catch(errMsg => {
                weui.alert(errMsg)
              })
            }
          }]
        })
      })

      // $('#editApply').on('click', () => { // 编辑活动

      // })
      // $('.actAddr').on('click', (e) => {
      //   pickerAddr.showAddr(e.currentTarget)
      // })
      // $('#theme').click((e) => {
      //   let _thi = this
      //   require.ensure([], () => {
      //     require('vendor/dialog')
      //     $.alert.aler({
      //       title: '提示',
      //       content: textAreaTemp,
      //       height: 320,
      //       blankclose: true,
      //       okCallback: function () {
      //         $(e.currentTarget).val(_thi.getVal())
      //       }
      //     })
      //   }, 'aler')
      // })
    },
    getVal () {
      return $('textarea[name=theme]').val()
    },
    switch () {
      let TYPE
      $('.nav_fixed_catgoods').on('click', '.fixed_nav_item_catgoods', (e) => {
        $(e.currentTarget).find('span').addClass('nav_cur_cat').parent().siblings().find('span').removeClass('nav_cur_cat')
        TYPE = $(e.currentTarget).data('type')
        if (TYPE === 'baseInfo') {
          $('.act-base-info').show().siblings().hide()
        } else {
          $('.act-mag').show().siblings().hide()
        }
      })
    },
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
    },
    _failItemTemp (data) { // 被拒绝人员模板
      if (data.length > 0) {
        let mainPer = data[0].guest_name
        return ` ${data.map(key => `
        <div class="fail-item">
          <div class="weui-cell fail-item-top">
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
              <div class="moreInfo show" style="display: none;">
                <div class="moreInfo-top">
                  <p>${key.guest_sex}</p>
                  <p>${key.guest_tel}</p>
                </div>
                <div class="moreInfo-midd">
                ${key.guest_realname !== '' ? `<span>真实姓名：${key.guest_realname}</span>` : ''}
                ${key.guest_idcard !== '' ? `/<span>身份证号：${key.guest_idcard}</span>` : ''}
                </div>
                
                <div class="moreInfo-dowm">
                  <a class="txt-green" href="tel:${key.guest_tel}">电话</a>
                  <a class="text-red" data-id="${key.guest_id}">已拒绝</a>
                </div>
              </div>
            </div>
        `)}`
      } else {
        return ''
      }
    },
    _unreviewItemTemp (data) { // 未审核人员模板
      if (data.length > 0) {
        let mainPer = data[0].guest_name
        return ` ${data.map(key => `
        <div class="unreview-item">
          <div class="weui-cell unreview-item-top">
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
              <div class="moreInfo show" style="display: none;">
                <div class="moreInfo-top">
                  <p>${key.guest_sex}</p>
                  <p>${key.guest_tel}</p>
                </div>
                <div class="moreInfo-midd">
                ${key.guest_realname !== '' ? `<span>真实姓名：${key.guest_realname}</span>` : ''}
                ${key.guest_idcard !== '' ? `/<span>身份证号：${key.guest_idcard}</span>` : ''}
                </div>
                
                <div class="moreInfo-dowm">
                  <a class="txt-green" href="tel:${key.guest_tel}">电话</a>
                  <a class="txt-green btn-edit">编辑</a>
                  <a class="text-red btn-review" data-id="${key.guest_id}">审核</a>
                </div>
              </div>
            </div>
        `)}`
      } else {
        return ''
      }
    },
    _unclassItemTemp (data) { // 未分组人员模板
      if (data.length > 0) {
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
              <div class="moreInfo show" style="display: none;">
                <div class="moreInfo-top">
                  <p>${key.guest_sex}</p>
                  <p>${key.guest_tel}</p>
                </div>
                <div class="moreInfo-midd">
                ${key.guest_realname !== '' ? `<span>真实姓名：${key.guest_realname}</span>` : ''}
                ${key.guest_idcard !== '' ? `/<span>身份证号：${key.guest_idcard}</span>` : ''}
                </div>
                
                <div class="moreInfo-dowm">
                  <a class="txt-green" href="tel:${key.guest_tel}">电话</a>
                  <a class="txt-green btn-edit">编辑</a>
                  <a class="text-red btn-audit" data-id="${key.guest_id}">分组</a>
                </div>
              </div>
            </div>
        `)}`
      } else {
        return ''
      }
    },
    _getGroups (arr) { // 获取分组信息
      $('.g-lists').html(clear(this._groupTemp(arr)))
    },
    _getUnClassPer (data) { // 获取未分组人员信息
      $('.unclass-lists').html(clear(this._unclassItemTemp(data)))
    },
    _getUnreviewPer (data) { // 获取未审核人员信息
      $('.unreview-lists').html(clear(this._unreviewItemTemp(data)))
    },
    _getFailPer (data) { // 获取被拒绝的人员信息
      $('.fail-lists').html(clear(this._failItemTemp(data)))
    },
    _getActInfoData (data) {
      let sales = data.list[0].sales
      let theme = data.list[0].act_name
      let detail = data.list[0].act_detail_text
      let applyEndTime = data.list[0].apply_endtime
      let actStartTime = data.list[0].act_kstime
      let actEndTime = data.list[0].act_jstime
      let actAddr = data.list[0].act_addr
      let actDetailAddr = data.list[0].act_addrs
      let actState = data.list[0].act_state
      let review = data.list[0].apply_review
      let group = data.group
      let guest = data.guest
      if (review === '是') { // 如果报名需要审核
        $('.r-group').show()
      } else {
        $('.r-group').hide()
      }
      this._getGroups(group)
      let unreviewGuest = []
      let unclassGuest = []
      let failGuest = []
      let guestLen = guest.length
      for (let i = 0; i < guestLen; i++) {
        if (guest[i].guest_reviewed === '待审') {
          unreviewGuest.push(guest[i])
        } else if (guest[i].guest_reviewed === '已审') {
          unclassGuest.push(guest[i])
        } else if (guest[i].guest_reviewed === '拒绝') {
          failGuest.push(guest[i])
        }
      }
      if (unclassGuest.length > 0) {
        $('.m-group').show()
      } else {
        $('.m-group').hide()
      }
      if (failGuest.length > 0) {
        $('.f-group').show()
      } else {
        $('.f-group').hide()
      }
      this._getUnClassPer(unclassGuest)// 在活动管理页面获取未分组游客信息
      this._getUnreviewPer(unreviewGuest)// 在活动管理页面获取未审核游客信息
      this._getFailPer(failGuest) // 在活动管理页面获取被拒绝游客信息
      batchG.batchGetUnclassPer(unclassGuest)// 这里是批量分组里面获取未分组游客信息
      batchReview.batchGetUnreviewPer(unreviewGuest)// 这里是批量审核里面获取未审核游客信息

      if (actState === '关闭报名') {
        $('#openApply').find('button').html('打开活动')
      } else if (actState === '报名中') {
        $('#openApply').find('button').html('关闭活动')
      }

      $('#editApply a').attr('href', `act-create.html?id=${getQueryString('id')}`)
      $('#actDetail').on('click', () => {
        window.location.href = `act-create.html?id=${getQueryString('id')}`
      })
      $('.actInfoInner ul li:first').find('span').html(sales)
      $('#theme').val(theme)
      $('#actDetail').val(detail)
      $('#applyDeadline').val(applyEndTime)
      $('#actStartLine').val(actStartTime)
      $('#actEndLine').val(actEndTime)
      $('#Actaddr').val(actAddr)
      $('input[name=actDetailAddr]').val(actDetailAddr)
      $('.unclassLen').html(`(${$('.unclass-item').length})`)
      $('.unreviewLen').html(`(${$('.unreview-item').length})`)
      $('.failLen').html(`(${$('.fail-item').length})`)
    },
    _initActData () { // 刷新重新初始化数据
      model.getActDetailData({id: getQueryString('id')}).then(data => {
        Home._getActInfoData(data)// 获取活动详细信息
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    _getData () {
      model.getMagInfo({id: getQueryString('id')}).then(args => {
        this._getActInfoData(args[0])// 获取活动详细信息
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

export {all}
