import './travel-detail.less'
import 'components/banner/banner.less'
import weui from 'weui.js'
import model from 'api/getIndex'
import {getQueryString} from 'common/js/dom'
import $ from 'jquery'

let all = (function () {
  let Home = {
    pageInit () {
      this.getDetail()
    },
    linkActTemp (data) {
      return `<div class="item-goods">
      <a href="act-detail.html?id=${data.travel_actid}">
        <div class="goods-img" style="background-image: url('${data.travel_act_img}')">
        </div>
        <div class="goods-name">
          <p>${data.travel_actname}</p>
        </div>
        <p class="spec">活动时间:${data.travel_act_time}</p>
      </a>
    </div>`
    },
    getDetail () {
      model.travel.getTravelDetail({id: getQueryString('id')}).then(data => {
        if (data.state === 'ok') {
          $('.new-title').html(data.travel_name)
          $('.new-pic img').attr('src', data.travel_author_head)
          $('.new-head span').html(data.travel_author)
          $('.new-txt').html(data.travel_content)
          if (data.travel_actid !== '') { // 如果关联有活动
            $('#linkAct').html(this.linkActTemp(data))
          }
          if (data.travel_my) { // 如果是发布自己的游记
            $('.weui-tabbar').show()
          } else {
            $('.weui-tabbar').hide()
          }
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
