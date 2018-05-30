import './setApplyCost.less'
import $ from 'jquery'
import weui from 'weui.js'
import {Trim} from '../../common/js/dom'
import {pickerData} from 'components/picker/picker'

let costWay = { // 费用设置类方法
  _id: '',
  _feeApllyNum: 0, // 设置的限制活动总人数
  _fee: false, // 默认免费
  _ischeck: 0, // 是否允许其他支付方式 0：不允许 1：允许
  _actDetail: null, // 是否有人报名 null:没有 ！null:有
  _canRefund: 1, // 可退款
  _refundTime: '', // 退款时间
  init () {
    $('#fee').on('click', () => {
      this._showfee()
      $('input[name=applyCostType]').val('收费')
      this._fee = true
    })
    $('#unfee').on('click', () => {
      this._showunfee()
      $('input[name=applyCostType]').val('免费')
      this._fee = false
    })

    $('#addfee').on('click', () => {
      this._addfeeItem()
    })

    $('#feeItem').on('click', '.removeIcon', (e) => {
      this._removeItem(e.currentTarget)
    })

    $('.refund').on('click', (e) => {
      this.refund(e.currentTarget)
    })

    $('#applyCostCancel').on('click', (e) => {
      this.hide()
    })
    $('#applyCostSave').on('click', (e) => {
      this._saveApply()
    })
  },
  hide () {
    $('#setApplyCost').hide()
  },
  show () {
    $('#setApplyCost').show()
  },
  /* 活动开始前均可申请退款 */
  _setBeforeActRefund () {
    // if (this._refundTime === '') {
    //   var postBeginTime = $('#post_begintime').val()
    //   $('#refundTime').val(postBeginTime) // 默认活动开始时间
    // }
    this._canRefund = 1 // 可退款
    window.localStorage.setItem('post_canRefund', 1)
  },

  /* 指定时间可退款 */
  _setConfirmTimeRefund () {
    this._canRefund = 2 // 可退款
    window.localStorage.setItem('post_canRefund', 2)
  },

  /* 不可退款 */
  _setUnRefund () {
    this._canRefund = 3 // 不可退款
    window.localStorage.setItem('post_canRefund', 3)
  },
  refund (thi) { // 退款设置
    // 费用不为0可设置退款记录
    let me = this// this代表费用设置类方法这个对象
    let $feeprice = $('.feeitems').find('input.feeprice')
    let flag = false
    if ($feeprice.length > 0) {
      for (var k = 0; k < $feeprice.length; k++) {
        var feeprice = Trim($feeprice[k].value, 'g')
        console.log(feeprice)
        if (feeprice === '0' || feeprice === '') { // 遍历到有0的费用
          flag = true
        }
      }
      if (flag) {
        weui.alert('费用金额要大于0')
      } else {
        weui.actionSheet([
          {
            label: '活动开始前均可申请退款',
            onClick: function () {
              $('.refund').find('.weui-select input').val('活动开始前均可申请退款')
              me._setBeforeActRefund()
            }
          }, {
            label: '指定时间前可申请退款',
            onClick: function () {
              pickerData.showDate(thi)
              me._setConfirmTimeRefund()
            }
          }, {
            label: '不支持退款',
            onClick: function () {
              $('.refund').find('.weui-select input').val('不支持退款')
              me._setUnRefund()
            }
          }
        ], [
          {
            label: '取消',
            onClick: function () {
              console.log('取消')
            }
          }
        ])
      }
    } else {
      weui.alert('请先设置金额')
    }
  },
  _applyCostTemp (arr, arrPrice, arrNum) {
    return `${arr.map((key, i) => `
    <li class="row">
   
    <div class="col-70">
    <div class="act_cost_title f-l">${arr[i]}</div>
    <input type="hidden" name="applyCostName" value="${arr[i]}">
    <div class="act_cost_people f-s ">
    <span>名额</span>${arrNum[i]}人
    <input type="hidden" name="applyCostNum" value="${arrNum[i]}">
    </div>
    </div>
    <div class="col-30">
    <div class="act_cost_num f-l-x">￥<span>${arrPrice[i]}</span></div>
    <input type="hidden" name="applyCostPrice" value="${arrPrice[i]}">
    </div></li>
  `).join('')}`
  },
  _saveApply () {
    let allNum = 0

    if (this._fee) { // 如果是收费
      let arr = []// 存储费用名称的数组
      let arrPrice = []// 存储费用金额的数组
      let arrNum = []// 存储费用名额的数组

      let feeApllyNum = parseInt($.trim($('#feeApllyNum').val()))// 获取活动总名额
      $('#feeItem .feeitems').each(function (i, e) {
        arr[i] = $(this).find('.fyName').val() // 把选择的费用名称存进数组中
        arrPrice[i] = $(this).find('.feeprice').val()// 把选择的费用金额存进数组中
        arrNum[i] = $(this).find('.feenum').val()// 把选择的费用名额存进数组中
        allNum += parseInt($(this).find('.feenum').val())
      })

      let arrLength = arr.length

      if (arrLength > 0) {
        for (let i = 0; i < arrLength; i++) {
          if (arr[i] === '') {
            weui.alert('第' + (i + 1) + '项的费用名称不能为空')
            return false
          } else if (arrPrice[i] === '') {
            weui.alert('第' + (i + 1) + '项的费用金额不能为空')
            return false
          } else if (arrNum[i] === '') {
            weui.alert('第' + (i + 1) + '项的费用名额不能为空')
            return false
          } else if (arr[i] === arr[i + 1]) {
            weui.alert('费用名称重复：' + arr[i])
            return false
          }
        }
      } else {
        weui.alert('请设置费用')
      }

      if ($.trim($('#feeApllyNum').val()) === '') {
        weui.alert('活动总名额不能为空')
        return false
      } else if (feeApllyNum < allNum) {
        weui.alert('费用设置名额之合不能大于活动总名额')
        return false
      }

      if ($('input[name=payOnline]').val() === '否' && $('input[name=otherPay]').val() === '否') {
        weui.alert('在线支付和其他支付方式至少选择一个')
        return false
      }
      $('#fymx').append(this._applyCostTemp(arr, arrPrice, arrNum))
      $('#actCost').find('.weui-select').html('收费')
      weui.alert('添加成功')
      this.hide()
    } else { // 如果是免费
      $('#actCost').find('.weui-select').html('免费')
      $('.act_cost_ticket').remove()
      weui.alert('添加成功')
      this.hide()
    }
    $('input[name=applyCostNums]').val($('input[name=fysfzme]').val())// 活动总名额
    $('input[name=ExpDescr]').val($('textarea[name=ExpDescr]').val())// 活动须知
    $('input[name=payOnlineInput]').val($('input[name=payOnline]').val())// 是否在线付费
    $('input[name=otherPayInput]').val($('input[name=otherPay]').val())// 是否其他付费方式
    $('input[name=refund]').val($('input[name=refundSet]').val())// 退款设置
  },
  _removeItem (item) {
    $(item).parents('.feeitems').remove()
    let feelength = $('div[name="feeitems"]').length
    if (feelength < 6) {
      $('#addfee').show()
      $('#unaddfee').hide()
    }
  },
  _addfeeItem () {
    let html = `<div name="feeitems" class="feeitems">
    <div class="list-block margin">
      <ul>
        <li>
          <div class="item-content">
            <div class="item-media removeIcon">
              <span>
                <img src="${require(`../../imgs/icons/removeIcon.png`)}" alt="">
              </span>
            </div>
            <div class="item-inner">
              <div class="item-title small-txt high-grey">
                费用设置
              </div>
              <div class="item-after  entered-input" style="width:70%;">
                <input id="feename" maxlength="20" type="text" name="fyName" class="fyName"
                placeholder="20字以内">
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="item-content">
            <div class="item-media">
            </div>
            <div class="item-inner">
              <div class="item-title small-txt high-grey">
                金额
              </div>
              <div class="item-after  entered-input" style="width:70%;">
                <input class="feeprice" pattern="[0-9]*" type="number" name="fyje" placeholder="有人报名后不能修改">
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="item-content">
            <div class="item-media">
            </div>
            <div class="item-inner">
              <div class="item-title small-txt high-grey">
                名额
              </div>
              <div class="item-after  entered-input" style="width:70%;">
                <input class="feenum" pattern="[0-9]*" type="number" name="fyme" placeholder="默认不限">
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
</div> `
    $('#feeItem').append(html)
    let feelength = $('div[name="feeitems"]').length
    if (feelength >= 6) {
      $('#addfee').hide()
      $('#unaddfee').show()
    }
  },
  _showunfee () {
    $('.showunfee').show()
    $('.showfee').hide()
    $('#unfeeDetail').show()
    $('#feeDetail').hide()
  },
  _showfee () {
    let $feename = $('.feeitems').find('input[id=feename]')
    if ($feename.length >= 6) {
      $('#addfee').hide()
    } // 添加的费用超过六个，添加费用按钮就消失
    $('.showfee').show()
    $('.showunfee').hide()
    $('#feeDetail').show()
    $('#unfeeDetail').hide()
    $('#costDesc').show()
  }

}

export {costWay}
