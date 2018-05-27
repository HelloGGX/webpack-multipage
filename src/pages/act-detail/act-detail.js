import './act-detail.less'
import 'components/banner/banner.less'

import $ from 'jquery'
import BScroll from 'better-scroll'
import weui from 'weui.js'
import {getQueryString} from 'common/js/dom'

import model from 'api/getIndex'

let all = (function () {
  let imgScroll = {

    currentIndex: 0,
    scrol: new BScroll('.content-wrapper', {
      probeType: 3,
      click: true
    }),
    init () {
      let imgHeight = document.getElementsByClassName('v5-banner')[0].clientHeight
      document.getElementsByClassName('act-list')[0].style.top = imgHeight + 'px'
      $('.go-top').on('click', (e) => {
        this.toTop()
      })
      $('.header-nav li').on('click', (e) => {
        this.navSwitch(e)
      })
      this.scrolling(imgHeight)
    },
    navSwitch (e) {
      var anchorIndex = $(e.currentTarget).data('index')
      $(e.currentTarget).addClass('active').siblings().removeClass('active')
      this.scrol.scrollToElement(document.getElementsByClassName('flagIndex')[anchorIndex], 100, false, 260)
    },
    toTop () {
      this.scrol.scrollToElement(document.getElementsByClassName('act-list')[0], 100, false, 0)
    },
    moveScroll (newY) { // 页面滑动弹出
      let banner = $('.banner-container')
      var f = $('.go-top')
      if (!isNaN(newY)) {
        (-newY < 340) ? f.addClass('top-button-hide').removeClass('top-button-show') : f.removeClass('top-button-hide').addClass('top-button-show');
        (-newY < 240) ? banner.addClass('banner-fade').find('.banner-tit').hide() : banner.removeClass('banner-fade').find('.banner-tit').show()
      }
    },
    getOffsetTopIndex (clas, i) {
      return $($('.' + clas)[i]).offset().top
    },
    scrolling (imgHeight) {
      let len = $('.flagIndex').length
      let arr = []
      for (var n = 0; n < len; n++) {
        arr.push(this.getOffsetTopIndex('flagIndex', n))
      }
      this.scrol.on('scroll', (pos) => {
        var newY = pos.y
        for (var i = 0; i < len; i++) {
          if (-newY >= arr[i]) {
            $($('.header-nav li')[i]).addClass('active').siblings().removeClass('active')
          }
        }
        this.moveScroll(newY)// 显示回到顶部按钮
        $('.bg-layer').css({'transform': 'translate3d(0,' + newY + 'px,0)'})
        var percent = Math.abs(newY / imgHeight)// 拖动图片变大的算法
        var zIndex = 0
        var scale = 1
        if (newY > 0) {
          scale = 1 + percent
          zIndex = 10
        }
        $('.v5-banner').css({'z-index': zIndex, 'transform': 'scale(' + scale + ')'})
      })
    }

  }
  let home = {
    pageInit: function () {
      imgScroll.init()
      this._getActDetailData()
    },
    _getActDetailData: function () {
      model.getActDetailData({id: getQueryString('id')}).then((data) => {
        console.log(data)
        let actId = data.list[0].act_id
        let clubId = data.club[0].club_id
        let hdThumbUrl = data.list[0].hd_thumb_url
        let price = data.list[0].price
        let clubName = data.club.club_name
        let clubMember = data.club.club_member
        let clubActs = data.club.club_acts
        let actName = data.list[0].act_name
        let actType = data.list[0].act_type
        let actAddr = data.list[0].act_addr
        let actStartTime = data.list[0].act_kstime
        let actEndTime = data.list[0].act_jstime
        let actIntegral = data.list[0].act_integral
        let sales = data.list[0].sales
        let salesLimit = data.list[0].sales_limit
        let clubRecentAct = data.club_recent_act
        let actNotice = data.list[0].act_should_know
        let detailText = data.list[0].act_detail_text
        let detailImgs = data.list[0].act_detail_imgs
        $('.v5-banner').css({'background-image': 'url(' + hdThumbUrl + ')'})
        $('.index_price').html(price)
        $('.goods-buy-price').html(`<i>￥</i>${price}`)
        $('.g-repeated-coupon-tag').html(clubName)
        $('#index_name').html(actName)
        $('.g-service-list').html(`${actType.map((key) => `<span class="g-service-item">${key}</span>`)}`)
        $('.goods-mall-name').html(clubName)
        $('.goods-mall-info span:first').html(`活动数量&nbsp;${clubActs}`)
        $('.goods-mall-info span:last').html(`会员数量&nbsp;${clubMember}`)
        $('input[name=MeetingPlace]').val(actAddr)
        $('input[name=startTime]').val(actStartTime)
        $('input[name=endTime]').val(actEndTime)
        $('input[name=actStar]').val(actIntegral)
        $('input[name=applyPeople]').val(`${sales}/${salesLimit}`)
        $('.mall-recommend-main ul').html(`
          ${clubRecentAct.map((act) =>
    `<li class="mall-recommend-item">
            <img src="${act.thumb_url}">
            <span class="mr-goods-name">
              ${act.act_name}
            </span>
            <div class="mr-goods-detail">
              <span class="mr-price">
                <i> ￥</i>
                ${act.price}
              </span>
            </div>
          </li>`
  )}
        `)
        $('#notice').html(actNotice)
        $('#detailText').html(detailText)
        $('.act-detail-img').html(`
        ${detailImgs.map((item) => `
        <li class="gd-item">
        <img src="${item}" alt="">
    </li>
        `)}
        `)
        $('.goods-group-btn a').attr('href', `act-apply.html?id=${actId}&clubId=${clubId}`)
      }).catch((errMess) => {
        // 获取数据失败时的处理逻辑
        weui.alert(errMess)
      })
    }

  }
  return home
}())

$(function () {
  all.pageInit()
})
