import './travel-list.less'
import 'components/banner/banner.less'
import weui from 'weui.js'
import model from 'api/getIndex'
import $ from 'jquery'
import { imgSuffix } from 'common/js/dom'

let all = (function () {
  let Home = {
    pageInit () {
      this.getList()
    },
    travTemp (data, i) {
      return `<div class="store-item" data-id="${i}">
      <a href="travel-detail.html?id=${data[i].travel_id}">
          <div class="store-content">
              <div class="goods-image">
                  <div class="image-container" style="background-image: url('${imgSuffix(data[i].travel_img, 2)}')">
                  </div>
              </div>
              <div class="goods-detail">
                  <p class="goods-name">${data[i].travel_name}</p>
                  <div class="goods-content">
                      <p class="goods-sales">更新时间${data[i].travel_time}</p>
                  </div>
                  <div class="author">
                      <div class="author-head">
                          <img src="${data[i].travel_author_head}" alt="">
                      </div>
                      <div class="author-name">
                          <p>作者名${data[i].travel_author}</p>
                      </div>
                  </div>
              </div>
          </div>
      </a>
  </div>`
    },
    getList () {
      model.travel.getTravelList().then(data => {
        if (data.state === 'ok') {
          let travel = data.travel
          let len = travel.length
          let _html = ''
          for (let i = 0; i < len; i++) {
            _html += this.travTemp(travel, i)
          }
          $('#news').html(_html)
        }
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
