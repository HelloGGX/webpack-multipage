import './orders.less'
import 'components/banner/banner.less'
import 'components/tabs/tabs.less'
import $ from 'jquery'
import weui from 'weui.js'
import model from '../../api/getIndex'

let all = (function () {
  let TYPE = 'paid'
  let allData = {// 获取该页所有数据
    init () {
      this._getOrderData()
    },
    _getOrderData () {
      model.orders.getOrderData().then((data) => { // 获取数据成功时的处理逻辑
        console.log(data)
      }).catch((ErrMsg) => { // 获取数据失败时的处理逻辑
        weui.alert(ErrMsg)
      })
    }
  }// 获取所有数据
  let Home = {
    pageInit: function () {
      allData.init()
      this.switch()
    },

    switch: function () {
      $('.nav_fixed_catgoods').on('click', '.fixed_nav_item_catgoods', (e) => {
        $(e.currentTarget).find('span').addClass('nav_cur_cat').parent().siblings().find('span').removeClass('nav_cur_cat')
        TYPE = $(e.currentTarget).data('type')
        if (document.getElementById(TYPE)) {
          $(document.getElementById(TYPE)).show().siblings().hide()
        } else {
          allData.init()
        }
      })
    }
  }

  return Home
}())

$(function () {
  all.pageInit()
})
