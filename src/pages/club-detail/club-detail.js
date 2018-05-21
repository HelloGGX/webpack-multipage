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
            this._getActs()
          } else if (index === 2) {
            this._getAlbums()
          } else if (index === 3) {
            this._getNews()
          }
        }
      })
    },
    _getNews () { // 获取游记信息
      let newdata
      let _html = ''
      newdata = DATA['news']
      let len = newdata.length
      for (let i = 0; i < len; i++) {
        _html += this._newTemp(i, newdata)
      }
      $('#news').html(_html)
    },
    _newTemp (i, data) { // 游记模板
      return `<div class="store-item" data-id="${data[i].id}">
      <a href="">
      <div class="store-content">
          <div class="goods-image">
              <div class="image-container">
                  <img src="${data[i].thumb}" alt="">
              </div>
          </div>
          <div class="goods-detail">
              <p class="goods-name">${data[i].title}</p>
              <div class="goods-content">
                  <p class="goods-sales">更新时间${data[i].release_time}</p>
              </div>
              <div class="author">
                  <div class="author-head">
                      <img src="${data[i].author_thumb}" alt="">
                  </div>
                  <div class="author-name">
                      <p>${data[i].author_name}</p>
                  </div>
              </div>
          </div>
      </div>
      </a>
  </div>`
    },
    _getAlbums () { // 获取相册信息
      let newdata
      let _html = ''
      newdata = DATA['albums']

      let len = newdata.length
      for (let i = 0; i < len; i++) {
        _html += this._albumsTemp(i, newdata)
      }
      if ($('.tidbits-con .col-50').length > 1) {
        $('#addAlbums').parent().nextAll().html(_html)
      } else {
        $('#addAlbums').parent().after(_html)
      }
    },
    _albumsTemp (i, data) { // 活动相册模板
      return `<div class="col-50" data-id="${data[i].id}" style="margin-top: 0.1rem;">
      <a href="#">
          <div class="tidbits-item">
              <div class="tidbits-img">
                  <img src="${data[i].photos[0].url[0]}" alt="">
              </div>
              <div class="tidbits-inner">
                  <p class="f-s">${data[i].name}</p>
                  <p class="f-s text-right">${data[i].photos_num}张</p>
              </div>
          </div>
      </a>
  </div>`
    },
    _getActs () { // 获取活动列表信息
      let newdata
      let _html = ''
      newdata = DATA['club_acts']
      let len = newdata.length
      for (let i = 0; i < len; i++) {
        _html += this._actTemple(i, newdata)
      }
      $('#acts').html(_html)
    },
    _actTemple (i, data) { // 模板
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
                    <div class="goods-market-price">报名人数:${data[i].apply_num}</div>
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
