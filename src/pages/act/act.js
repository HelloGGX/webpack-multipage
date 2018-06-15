import './act.less'
import 'components/tabs/tabs.less'
import model from '../../api/getIndex'
import $ from 'jquery'
import weui from 'weui.js'

let all = (function () {
  let TYPE = 'city'
  let DATA = null
  let allData = {// 获取该页所有数据
    init () {
      this._getActData()
    },
    _getActData () {
      model.getActData().then((data) => { // 获取数据成功时的处理逻辑
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
    _temple (i, data) { // 模板
      return `<div class="store-item" data-id=${data[i].id}>
            <a href="act-detail.html?id=${data[i].id}">
            <div class="store-content">
                <div class="goods-image">
                    <div class="image-container" style="background-image:url(${data[i].imgsrc})">
                       
                    </div>
                </div>
                <div class="goods-detail">
                    <p class="goods-name">${data[i].name}</p>
                    <div class="goods-content">
                        <p class="goods-sales">活动时间${data[i].time}</p>
                        <p class="goods-sales">活动积分${data[i].integral}</p>
                    </div>
                    <del class="goods-market-price">${data[i].price}</del>
                    <div class="discount-price"><i>￥</i>${data[i].price}</div>
                    <div class="goods-buy">立即查看</div>
                </div>
            </div>
            </a>
            </div>`
    },
    _getNewData (data) {
      let newdata
      let _html = ''
      newdata = data[TYPE]
      if (newdata === null) {
        $('#act-grid').html(`<div class="nothing-text">
        <div class="nothing-img"></div>
        <p>暂时还没有活动</p>
    </div>`)
      } else {
        let len = newdata.length
        for (let i = 0; i < len; i++) {
          _html += Home._temple(i, newdata)
        }
        $('#act-grid').append("<li class='goods_grid_wrapper stores' id=" + TYPE + ' data-type=' + TYPE + '></li>')
        $('#' + TYPE).html(_html)
        $(document.getElementById(TYPE)).show().siblings().hide()
      }
    },
    switch () {
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
