import './act-detail.less'
import 'components/banner/banner.less'

import $ from 'jquery'
import BScroll from 'better-scroll'
import weui from 'weui.js'
import {getQueryString, clear, imgSuffix} from 'common/js/dom'

import model from 'api/getIndex'

let all = (function () {
  let imgScroll = {

    currentIndex: 0,
    scrol: new BScroll('.act-list', {
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
      this.scrol.scrollToElement(document.getElementsByClassName('flagIndex')[anchorIndex], 100, false, 240)
    },
    toTop () {
      this.scrol.scrollToElement(document.getElementsByClassName('act-list')[0], 100, false, 0)
    },
    moveScroll (newY) { // 页面滑动弹出
      let banner = $('.banner-container')
      var f = $('.go-top')
      if (!isNaN(newY)) {
        (-newY < 340) ? f.addClass('top-button-hide').removeClass('top-button-show') : f.removeClass('top-button-hide').addClass('top-button-show');
        (-newY < 280) ? banner.addClass('banner-fade').find('.banner-tit').hide() : banner.removeClass('banner-fade').find('.banner-tit').show()
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
    pageInit () {
      this._getActDetailData()
    },
    _getActDetailData () {
      model.getActDetailData({id: getQueryString('id')}).then((data) => {
        let actId = data.list[0].act_id
        let clubId = data.club.club_id
        let hdThumbUrl = data.list[0].hd_thumb_url
        let price = data.list[0].price
        let clubName = data.club.club_name
        let clubMember = data.club.club_member
        let clubActs = data.club.club_acts
        let clubLogo = data.club.club_logo
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
        let actState = data.list[0].act_state

        if (data.juge_apply) { // 到时候就需要去掉感叹号(如果该用户已经报名该活动)
          $('.goods-bottom-bar').append(`
          <div class="mag-group-btn">
                <a href="act-apply-mag.html?id=${actId}" class="apply-mag">
                    <span>报名管理(${data.guest.length})</span>
                </a>
            </div>
            <div class="mag-group-btn">
                <a class="apply-help">
                    <span>帮人报名</span>
                </a>
            </div>
          `)
        } else {
          $('.goods-bottom-bar').append(`
          <div class="goods-group-btn">
          <a>
              <span class="goods-buy-price index_price2"> 
              </span>
              <span>立即参加</span>
          </a>
      </div>
          `)
        }
        if (actState === '报名中') {
          $('.goods-group-btn a').attr('href', `act-apply.html?id=${actId}&clubId=${clubId}`)
          $('.mag-group-btn .apply-help').attr('href', `act-apply.html?id=${actId}&clubId=${clubId}`)
        } else if (actState === '关闭报名') {
          $('.goods-group-btn').css('backgroundColor', '#b7b7b7')
          $('.goods-group-btn a').attr('href', 'javascript:')
          $('.goods-group-btn a span:last-child').html('报名已经关闭')
          $('.mag-group-btn:last-child').css('backgroundColor', '#b7b7b7')
          $('.mag-group-btn .apply-help').attr('href', 'javascript:')
        }
        $('.v5-banner').css({'background-image': 'url(' + hdThumbUrl + ')'})
        $('.index_price').html(price)
        $('.goods-buy-price').html(`<i>￥</i>${price}`)
        $('.g-repeated-coupon-tag').html(clubName)
        $('#index_name').html(actName)
        $('.g-service-list').html(`${actType.map((key) => `<span class="g-service-item">${key}</span>`)}`)
        $('.goods-mall-main img').attr('src', imgSuffix(clubLogo, 2))
        $('.goods-mall-name').html(clubName)
        $('.goods-mall-info span:first').html(`活动数量&nbsp;${clubActs}`)
        $('.goods-mall-info span:last').html(`会员数量&nbsp;${clubMember}`)
        $('input[name=MeetingPlace]').val(actAddr)
        $('input[name=startTime]').val(actStartTime)
        $('input[name=endTime]').val(actEndTime)
        $('input[name=actStar]').val(actIntegral)
        $('input[name=applyPeople]').val(`${sales}/${salesLimit}`)
        $('.mall-recommend-main ul').html(`
          ${clear(`${clubRecentAct.map((act) =>
    `<li class="mall-recommend-item">
                    <img src="${imgSuffix(act.hd_thumb_url, 2)}">
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
  )}`)}
        `)
        $('#notice').html(actNotice)
        $('#detailText').html(detailText)
        $('.act-detail-img').html(`
        ${clear(`${detailImgs.map((item) => `
        <li class="gd-item">
        <img src="${item}" alt="">
    </li>
        `)}`)}
        `)
        imgScroll.init()
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
