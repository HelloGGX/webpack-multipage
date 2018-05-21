import './club-detail.less'
import 'components/banner/banner.less'
import 'components/tabs/tabs.less'
import $ from 'jquery'
import weui from 'weui.js'
import model from 'api/getIndex'

let all = (function () {
  let DATA
  let Home = {
    pageInit () {
      this.switch()
      this._getClubDetail()
    },
    switch () {
      weui.tab('#clubTab', {
        defaultIndex: 0,
        onChange: (index) => {
          if (index === 1) {
            this._acts()
          }
        }
      })
    },
    _acts () {
      let newdata
      let _html = ''
      newdata = DATA['club_acts']
      let len = newdata.length
      for (let i = 0; i < len; i++) {
        _html += this._temple(i, newdata)
      }
      $('#acts').html(_html)
    },
    _temple (i, data) { // 模板
      return `<div class="store-item" data-id=${data[i].id}>
            <a href="act-detail.html?id=${data[i].id}">
            <div class="store-content">
                <div class="goods-image">
                    <div class="image-container">
                        <img src=${data[i].imgsrc} alt="">
                    </div>
                </div>
                <div class="goods-detail">
                    <p class="goods-name">${data[i].name}</p>
                    <div class="goods-content">
                        <p class="goods-sales">活动时间${data[i].time}</p>
                    </div>
                    <del class="goods-market-price">${data[i].price}</del>
                    <div class="discount-price"><i>￥</i>${data[i].price}</div>
                    <div class="goods-buy">立即查看</div>
                </div>
            </div>
            </a>
            </div>`
    },
    _getClubInfo (data) {
      $('.club-logo img').attr('src', data.thumb_logo)
      $('.club-motto p').text(data.club_motto)
      $('.club-name').html(data.club_name)
      $('#clubId').html(data.club_id)
      $('#clubPer').html(data.club_people)
      $('.notice-info em').html(data.club_notice)
      $('#clubAddr').text(data.club_addr)
      $('#clubIntro').text(data.club_intr)
      $('#clubTips').html(data.club_major.map((key) => `<span>${key}</span>`))
      $('#clubPeople').html(`${data.club_people}人`)
      $('#clubRank').html(`活动人气榜前${data.club_rank}`)
    },
    _getClubDetail () {
      model.getClubDetailData().then((data) => {
        DATA = data
        console.log(DATA)
        this._getClubInfo(DATA)// 获取俱乐部基本数据
      }).catch((ErrMsg) => {
        // 获取数据失败时的处理逻辑
        weui.alert(ErrMsg)
      })
    }
  }

  return Home
}())

$(function () {
  all.pageInit()
})
