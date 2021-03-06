import './act.less'
import 'components/tabs/tabs.less'
import model from '../../api/getIndex'
import $ from 'jquery'
import weui from 'weui.js'
import { imgSuffix } from 'common/js/dom'
import { bubb } from 'vendor/bubble'

let all = (function () {
  let TYPE = 'city'
  let PULLDATA = []
  let PAGE = {
    city: 1,
    hot: 1,
    latest: 1
  }
  let Home = {
    pageInit () {
      this._getActData()
      let _thi = this
      bubb.init(() => {
        var loading = weui.loading('loading')
        setTimeout(() => {
          loading.hide(() => {
            bubb.update()
            window.location.reload()
          })
        }, 800)
      }, () => {
        setTimeout(() => {
          bubb.update()
          if (PULLDATA.length > 0) {
            PAGE[TYPE] += 3
            _thi._getActData(PAGE[TYPE], TYPE)
          }
        }, 800)
      })
      this.switch()
    },
    _getActData (page, type) {
      model.getActData({ page: page, type: type }).then((data) => { // 获取数据成功时的处理逻辑
        let newdata = null
        newdata = data[TYPE]
        PULLDATA = newdata
        if (data.load) { // 如果不是初始化，是下拉刷新
          let len = newdata.length
          if (len !== 0) { // 如果下拉刷新有值
            for (let i = 0; i < len; i++) {
              $('#' + TYPE).append(this._temple(i, newdata))
            }
          }
        } else { // 如果是初始化
          $('#act-grid').append("<li class='goods_grid_wrapper stores' id=" + TYPE + ' data-type=' + TYPE + '></li>')
          $(document.getElementById(TYPE)).show().siblings().hide()
          if (newdata.length === 0) { // 如果初始化没有数据
            $(`#${TYPE}`).html(`<div class="nothing-text">
              <div class="nothing-img"></div>
              <p>暂时还没有活动</p>
            </div>`)
            $('#pullup').hide()
          } else { // 如果初始化有数据
            let len = newdata.length
            if (len < 4) {
              $('.after-trigger').hide()
            }
            for (let i = 0; i < len; i++) {
              $('#' + TYPE).append(this._temple(i, newdata))
            }
          }
        }
      }).catch((ErrMsg) => { // 获取数据失败时的处理逻辑
        weui.alert(ErrMsg)
      })
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
                        <p class="goods-sales">活动经验${data[i].integral} <span>活动等级${data[i].level}</span></p>
                    </div>
                    <del class="goods-market-price">${data[i].price}</del>
                    <div class="discount-price"><i>￥</i>${data[i].price}</div>
                    <div class="goods-buy">立即查看</div>
                </div>
            </div>
            </a>
            </div>`
    },
    switch () {
      $('.nav_fixed_catgoods').on('click', '.fixed_nav_item_catgoods', (e) => {
        $(e.currentTarget).find('span').addClass('nav_cur_cat').parent().siblings().find('span').removeClass('nav_cur_cat')
        TYPE = $(e.currentTarget).data('type')
        if (document.getElementById(TYPE)) {
          $(document.getElementById(TYPE)).show().siblings().hide()
        } else {
          // PAGE[TYPE] = PAGE[TYPE]
          this._getActData(PAGE[TYPE], TYPE)
          $(document.getElementById(TYPE)).show().siblings().hide()
        }
      })
    }
  }

  return Home
}())

$(function () {
  all.pageInit()
})
