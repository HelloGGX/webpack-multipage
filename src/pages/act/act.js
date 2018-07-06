import './act.less'
import 'components/tabs/tabs.less'
import model from '../../api/getIndex'
import $ from 'jquery'
import weui from 'weui.js'
import {imgSuffix} from 'common/js/dom'
import {bubb} from 'vendor/bubble'

let all = (function () {
  let TYPE = 'city'
  let DATA = null
  let PAGE = 1
  let allData = {// 获取该页所有数据
    init () {
      this._getActData()
      let _thi = this
      bubb.init(() => {
        var loading = weui.loading('loading')
        setTimeout(() => {
          loading.hide(() => {
            bubb.update()
            this._getActData()
          })
        }, 800)
      }, () => {
        var loading = weui.loading('loading')
        setTimeout(() => {
          loading.hide(() => {
            bubb.update()
            PAGE += 3
            _thi._getActData(PAGE, TYPE)
          })
        }, 800)
      })
    },
    _getActData (page, type) {
      model.getActData({page: page, type: type}).then((data) => { // 获取数据成功时的处理逻辑
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
                    <div class="image-container" style="background-image:url(${imgSuffix(data[i].imgsrc, 2)})">
                       
                    </div>
                </div>
                <div class="goods-detail">
                    <p class="goods-name">${data[i].name}</p>
                    <div class="goods-content">
                        <p class="goods-sales">活动时间${data[i].time}</p>
                        <p class="goods-sales">活动积分${data[i].integral} <span>活动等级${data[i].level}</span></p>
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
      newdata = data[TYPE]

      if (newdata === null) {
        $('#act-grid').html(`<div class="nothing-text">
        <div class="nothing-img"></div>
        <p>暂时还没有活动</p>
    </div>`)
      } else {
        let len = newdata.length
        $('#act-grid').append("<li class='goods_grid_wrapper stores' id=" + TYPE + ' data-type=' + TYPE + '></li>')
        for (let i = 0; i < len; i++) {
          $('#' + TYPE).append(this._temple(i, newdata))
        }

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
