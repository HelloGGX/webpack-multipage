import './club.less'
import 'components/tabs/tabs.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'
import { imgSuffix } from 'common/js/dom'
import { bubb } from 'vendor/bubble'
import { search } from 'components/search/search'

let all = (function () {
  let TYPE = 'city'
  let PULLDATA = []
  let PAGE = {
    city: 1,
    hot: 1,
    star: 1
  }
  let Home = {
    pageInit () {
      search({ type: 'club' }).init()
      this._getNewData()
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
            PAGE[TYPE] += 6
            this._getNewData(PAGE[TYPE], TYPE)
          }
        }, 800)
      })
      this.switch()
    },
    _temple (i, data) { // 模板
      let keyword = data[i].keyword.split(',')
      return `<div class="margin weui-panel weui-panel_access" id="${TYPE + data[i].id}">
      <div class="weui-panel__bd">
        <a href="club-detail.html?clubId=${data[i].id}" class="weui-media-box weui-media-box_appmsg">
          <div class="club-thumb weui-media-box__hd " style="background-image:url(${imgSuffix(data[i].imgsrc, 2)})">
          </div>
          <div class="weui-media-box__bd">
            <h4 class="f-m weui-media-box__title">${data[i].name}</h4>
            <div class="star"><img src=${require(`../../imgs/icons/VIP${data[i].star}@2x.png`)} /></div>
            <div class="keyword">${keyword.map(key => `
              <span>${key}</span>
            `).join('')}
            </div>
            <p class="weui-media-box__desc">${data[i].slogan}</p>
          </div>
        </a>
      </div>
    </div>`
    },
    _getNewData (page, type) {
      model.getClubData({ page: page, type: type }).then((data) => {
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
          $('#club-grid').append("<li class='goods_grid_wrapper stores' id=" + TYPE + ' data-type=' + TYPE + '></li>')
          $(document.getElementById(TYPE)).show().siblings().hide()
          if (newdata.length === 0) { // 如果初始化没有数据
            $(`#${TYPE}`).html(`<div class="nothing-text">
              <div class="nothing-club"></div>
              <p>暂时还没有俱乐部</p>
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
      }).catch((ErrMsg) => {
        weui.alert(ErrMsg)
      })
    },
    switch () {
      $('.nav_fixed_catgoods').on('click', '.fixed_nav_item_catgoods', (e) => {
        $(e.currentTarget).find('span').addClass('nav_cur_cat').parent().siblings().find('span').removeClass('nav_cur_cat')
        TYPE = $(e.currentTarget).data('type')
        if (document.getElementById(TYPE)) {
          $(document.getElementById(TYPE)).show().siblings().hide()
        } else {
          // PAGE[TYPE] = PAGE[TYPE]
          this._getNewData(PAGE[TYPE], TYPE)
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
