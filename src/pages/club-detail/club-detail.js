import './club-detail.less'
import 'components/banner/banner.less'
import 'components/tabs/tabs.less'
import '../club-info/club-info.less'
import $ from 'jquery'
import weui from 'weui.js'
import model from 'api/getIndex'
import {getQueryString, clear, imgSuffix} from 'common/js/dom'
import {judgeLogin} from 'components/judgeLogin/judge-login'
import work from 'webworkify-webpack'

let all = (function () {
  let DATA
  let clubInfo = {
    init () {
      $('#clubInfoBack').on('click', (e) => {
        this.hide()
      })
      $('#clubInfoShow').on('click', () => {
        this.show()
      })
    },
    show () {
      $('#clubInfo').show()
    },
    hide () {
      $('#clubInfo').hide()
    },
    _getClubInfo (data) {
      $('#coverClubName').html(data.club_name)
      $('#coverClubId').html(data.club_id)
      $('#coverClubLogo').find('img').attr('src', imgSuffix(data.thumb_logo, 2))
      // $('#coverClubStar')
      $('#coverClubMajor').html(clear(`
      ${data.club_major.map(key => `<span>${key}</span>`)}
      `))
      $('#coverClubAddr').html(data.club_addr)
      $('#coverClubMotto').html(data.club_motto)
      $('#coverClubIntr p').text(data.club_intr)
      $('#coverClubMember').html(`<p>俱乐部成员${data.club_people}</p>`)
      $('.club-acts-num span').html(data.club_acts.length)
      let w = work(require.resolve('./calculate.js'))// 多线程计算报名人数总值
      w.postMessage([data])
      w.addEventListener('message', event => {
        $('.club-people-num span').html(event.data[0])
      })
    }
  }
  let Home = {
    pageInit () {
      this.switch()
      clubInfo.init()
      this._getClubDetail()

      judgeLogin(() => { // 如果已经登陆
        $('.join-club').click((e) => {
          weui.confirm('加入俱乐部成为会员', {
            title: '确定要要加入俱乐部吗？',
            buttons: [{
              label: '考虑一下',
              type: 'default',
              onClick: function () {}
            }, {
              label: '马上加入',
              type: 'primary',
              onClick: function () {
                model.joinClubData({clubId: getQueryString('clubId')}).then(res => {
                  if (res.clubs === 'ycj') { // 如果已经是俱乐部一员
                    require.ensure([], () => {
                      require('vendor/dialog')
                      $.alert.aler({
                        title: '提示',
                        content: '<p style="text-align: center;line-height: 0.44rem;font-size: 16px;">你已经是俱乐部的一员了</p>',
                        height: 'auto',
                        blankclose: true
                      })
                    }, 'aler')
                  } else {
                    require.ensure([], () => {
                      require('vendor/dialog')
                      $.alert.aler({
                        title: '提示',
                        content: '<p style="text-align: center;line-height: 0.44rem;font-size: 16px;">申请成功，正在加紧审核</p>',
                        height: 'auto',
                        blankclose: true
                      })
                    }, 'aler')
                  }
                }).catch(errMsg => {
                  weui.alert(errMsg)
                })
              }
            }]
          })
        })
      }, () => { // 如果还没登陆
        weui.confirm('你还没有登陆,请登陆再试一次~', {
          title: '提示',
          buttons: [{
            label: '先逛逛看',
            type: 'default',
            onClick: function () { console.log('no') }
          }, {
            label: '马上登陆',
            type: 'primary',
            onClick: function () { window.location.href = 'login.html' }
          }]
        })
        return false
      })
    },
    switch () {
      weui.tab('#clubTab', {
        defaultIndex: 0,
        onChange: (index) => {
          if (index === 1) {
            this._getActs()
          } else if (index === 2) {
            $('#addAlbums').parent().nextAll().remove()
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
      $('.tidbits-con .row').html(_html)
    },
    _albumsTemp (i, data) { // 活动相册模板
      return `<div class="col-50" data-id="${data[i].id}" style="margin-top: 0.1rem;">
      <a href="act-album.html?albumId=${data[i].id}">
          <div class="tidbits-item">
              <div class="tidbits-img">
                  <img src="${imgSuffix(data[i].photos[0].url[0], 2)}" alt="">
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
                    <div class="image-container" style="background-image:url(${imgSuffix(data[i].imgsrc, 2)})">
                      
                    </div>
                </div>
                <div class="goods-detail">
                    <p class="goods-name">${data[i].name}</p>
                    <div class="goods-content">
                        <p class="goods-sales">活动时间${data[i].time}</p>
                        <p class="goods-sales">活动积分${data[i].integral} <span>活动等级${data[i].level}</span></p>
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
      $('.club-logo').css('background-image', `url(${data.thumb_logo})`)
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
      model.getClubDetailData({clubId: getQueryString('clubId')}).then((data) => {
        DATA = data
        this._getClubInfo(DATA)// 获取俱乐部基本数据
        clubInfo._getClubInfo(DATA)
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
