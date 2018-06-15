import './orders.less'
import 'components/banner/banner.less'
import 'components/tabs/tabs.less'
import $ from 'jquery'
import weui from 'weui.js'
import model from '../../api/getIndex'
import {getQueryString} from 'common/js/dom'

let all = (function () {
  let TYPE = getQueryString('type')
  let DATA = null
  let allData = {// 获取该页所有数据
    init () {
      this._getOrderData()
    },
    _getOrderData () {
      model.orders.getOrderData().then((data) => { // 获取数据成功时的处理逻辑
        Home._getNewData(data)
        DATA = data
      }).catch((ErrMsg) => { // 获取数据失败时的处理逻辑
        weui.alert(ErrMsg)
      })
    }
  }// 获取所有数据

  let Home = {
    pageInit () {
      allData.init()
      this.switch()
    },
    _temple (i, data, type) { // 模板
      return `<div class="orders-item"  data="${i}">
      
      <div class="item-top-block">
        <div class="mall-name">
          <span class="mall-name-text"> ${data[i].order_actop}</span>
          <i class="iconfont icon-enter"></i>
          <p class="order-status">${type === 'receipt' ? `${data[i].act_apply > 0 ? `有人报名` : `暂时没人报名`}` : `${data[i].order_paystate === '1' ? '已付款' : '待付款'}`}</p>
        </div>
      </div>
      <div class="item-goods">
        <a href="act-detail.html?id=${type === 'receipt' ? `${data[i].order_id}` : `${data[i].order_actid}`}">
        <img class="goods-img" src="${data[i].order_actimg}">
        <div class="goods-name">
          <p>
        ${data[i].order_act}
          </p>
        </div>
        <p class="spec">
          ${type === 'receipt' ? `活动时间:${data[i].order_ksdate}` : `${data[i].order_actop}: ${data[i].order_actphone}`}
        </p>
        <div class="price-and-num">
          <div class="goods-price">

          </div>
          <div class="goods-number">
               ${type === 'receipt' ? `` : `x${data[i].order_num}`}
          </div>
        </div>
        </a>
      </div>
      ${type === 'receipt' ? `` : `<div class="currency-block">
      <p class="currency-free">(保险已购)</p>
      <p class="currency-amount">${data[i].order_money}</p>
      <p class="currency-head">实付
        <span>:</span>￥
      </p>
    </div>
    <div class="button-block">
      <div class="orders-button">
        ${data[i].order_paystate === '1' ? `<a class="delete"></a><a class="again"></a>` : `<a class="cancel"></a><a class="go-pay"></a>`}
      </div>
    </div>`}
   
    </div>`
    },

    _getNewData (data) {
      let newdata
      let _html = ''
      newdata = data[TYPE]
      console.log(TYPE)
      if (newdata === null) {
        $('#order-grid').html(`<div class="nothing-text">
        <div class="nothing-img"></div>
        <p>暂时还订单</p>
    </div>`)
      } else {
        let len = newdata.length
        for (let i = 0; i < len; i++) {
          _html += this._temple(i, newdata, TYPE)
        }
        $('#order-grid').append("<li class='goods_grid_wrapper stores' id=" + TYPE + ' data-type=' + TYPE + '></li>')
        $(`#${TYPE}`).html(_html)
        $(document.getElementById(TYPE)).show().siblings().hide()
      }
    },
    switch () {
      let item = $('.fixed_nav_item_catgoods')
      let len = item.length
      for (let i = 0; i < len; i++) {
        if ($(item[i]).data('type') === TYPE) {
          $(item[i]).find('span').addClass('nav_cur_cat').parent().siblings().find('span').removeClass('nav_cur_cat')
        }
      }
      $('.nav_fixed_catgoods').on('click', '.fixed_nav_item_catgoods', (e) => {
        $(e.currentTarget).find('span').addClass('nav_cur_cat').parent().siblings().find('span').removeClass('nav_cur_cat')
        TYPE = $(e.currentTarget).data('type')
        if (document.getElementById(TYPE)) {
          $(document.getElementById(TYPE)).show().siblings().hide()
        } else {
          this._getNewData(DATA)
        }
      })
    }
  }

  return Home
}())

$(function () {
  all.pageInit()
})
