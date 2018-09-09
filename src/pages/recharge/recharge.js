import './recharge.less'
import 'components/banner/banner.less'
import model from '../../api/getIndex'
import weui from 'weui.js'
import $ from 'jquery'

let all = (function () {
  let vip = {
    init () {
      $('.invite-user-button').on('click', (e) => {
        this.showVip($(e.currentTarget).data('vip'))
      })
    },
    getOpenId (i) {
      model.getOpenId().then(res => {
        const openId = res.openId
        if (openId === '') { // 如果没有openid就获取
          weui.alert('提示', {
            title: '微信支付需要授权，请确认',
            buttons: [{
              label: 'OK',
              type: 'primary',
              onClick: function () {
                window.location.href = 'http://www.shanduhuwai.com/api/openId.php'
              }
            }]
          })
        } else { // 如果有openid就支付
          this.vipPay(i)
        }
      }).catch(errMsg => {
        console.log(errMsg)
      })
    },
    vipPay (i) {
      model.vipPay({
        type: i
      }).then(res => {
        if (res.state === 'ok') {
          window.location.href = res.url
        }
      }).catch(err => {
        console.log(err)
      })
    },
    vipTemp (i) { // vip模板
      switch (i) {
        case 1:
          return `<div class="weui-cells weui-cells_form margin">
        <div class="weui-cell" style="padding:10px 0;">
            <div class="weui-cell__bd">
                <p> 298 元(全价)<p>
                <p>获得： 1 年会员权限</p>
                <p>获得： 300 礼品券 + 300 购物券</p>
                <p>首充送好礼： 一重好礼：385元美国三层电热饭盒</p>
                <div class="dialog-confirm" style="margin-top:0.1rem" data-type="${i}"><a href="javascript:;" class="weui-btn weui-btn_primary">购买VIP</a></div>
            </div>
        </div>
      </div>`
        case 3:
          return `<div class="weui-cells weui-cells_form margin">
        <div class="weui-cell" style="padding:10px 0;">
            <div class="weui-cell__bd">
                <p> 798 元(9 折) </p>
                <p> 获得： 3 年会员权限 </p>
                <p> 获得： 900 礼品券 + 900 购物券 </p>
                <p> 首充送好礼： 一重好礼： 385 元美国三层电热饭盒;二重好礼：价值798元德沃士便携榨汁杯 </p>
                <div class="dialog-confirm" style="margin-top:0.1rem" data-type="${i}"><a href="javascript:;" class="weui-btn weui-btn_primary"> 购买VIP </a></div>
            </div>
        </div>
      </div>`
        case 5:
          return `<div class="weui-cells weui-cells_form margin">
        <div class="weui-cell" style="padding:10px 0;">
            <div class="weui-cell__bd">
                <p> 1298 元(全价) </p>
                <p> 获得： 5 年会员权限 </p>
                <p> 获得： 1500 礼品券 + 1500 购物券 </p>
                <p> 首充送好礼： 一重好礼：385 元美国三层电热饭盒;二重好礼：价值798元德沃士便携榨汁杯;三重好礼： 价值1980元德沃士不锈钢高压锅（ 20 cm） </p>
                <div class="dialog-confirm" style="margin-top:0.1rem" data-type="${i}"><a href="javascript:;" class="weui-btn weui-btn_primary">购买VIP</a></div>
            </div>
        </div>
      </div>`
        case 10:
          return `<div class="weui-cells weui-cells_form margin">
        <div class="weui-cell" style="padding:10px 0;">
            <div class="weui-cell__bd">
                <p> 2598 元(全价) </p>
                <p> 获得： 10 年会员权限 </p>
                <p> 获得： 3000 礼品券 + 3000 购物券 </p>
                <p> 首充送好礼： 一重好礼：385元美国三层电热饭盒; 二重好礼：价值798元德沃士便携榨汁杯; 三重好礼：价值1980元德沃士不锈钢高压锅（ 20 cm）;四重好礼：价值3290元苏泊尔破壁机</p>
                <div class="dialog-confirm" style="margin-top:0.1rem" data-type="${i}"><a href="javascript:;" class="weui-btn weui-btn_primary"> 购买VIP</a></div>
            </div>
        </div>
      </div>`
      }
    },
    showVip (i) {
      require.ensure([], () => {
        require('vendor/dialog')
        $.alert.aler({
          title: `VIP${i}`,
          content: this.vipTemp(i),
          height: 'auto',
          blankclose: true,
          okCallback: (e) => {
            this.getOpenId($(e.currentTarget).data('type'))
          }
        })
      }, 'aler')
    }
  }
  // let selector = {
  //   NUM: Number($('.sd-coin a').html()),
  //   init () {
  //     $('#sku-input').on('input propertychange', function (e) {
  //       if (!/^\d+$/.test(this.value)) {
  //         this.value = ''
  //       }
  //     })
  //     $('.sku-selector-reduce').on('click', (e) => {
  //       this.reduce()
  //     })
  //     $('.sku-selector-increase').on('click', (e) => {
  //       this.increase()
  //     })
  //     $('#moneyChang').on('click', () => {
  //       if (this.NUM >= 500) {
  //         if (Number($('#sku-input').val()) > this.NUM) {
  //           weui.alert('兑换的度币不够啦')
  //         } else if (Number($('#sku-input').val()) <= 0) {
  //           weui.alert('兑换的度币不能为零或负')
  //         } else {
  //           model.postCoin({
  //             coin: $('#sku-input').val()
  //           }).then(res => {
  //             if (res.state === 'ok') {
  //               weui.alert('操作成功')
  //             }
  //           }).catch(errMsg => {
  //             weui.alert(errMsg)
  //           })
  //         }
  //       } else {
  //         weui.alert('兑换基数需要在500个度币才可以兑换')
  //       }
  //     })
  //   },

  //   increase () {
  //     let num = $('#sku-input').val()
  //     if (Number(num) + 1 > this.NUM) {
  //       return false
  //     } else if (Number(num) < 0) {
  //       $('#sku-input').val(0)
  //     } else {
  //       $('#sku-input').val(Number(num) + 1)
  //     }
  //   },
  //   reduce () {
  //     let num = $('#sku-input').val()
  //     if (Number(num) - 1 < 0) {
  //       return false
  //     } else if (Number(num) > this.NUM) {
  //       $('#sku-input').val(this.NUM)
  //     } else {
  //       $('#sku-input').val(Number(num) - 1)
  //     }
  //   }
  // }
  let Home = {
    pageInit () {
      // selector.init()
      vip.init()
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
