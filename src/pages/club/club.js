import './club.less'
import 'components/tabs/tabs.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'

let all = (function () {
  let TYPE = 'city'

  let search = {// 搜索框显示及查询
    deleteHistory () { // 删除历史记录
      $('#search_item').html('')
      // localStorage.setItem('searchkey', '')
    },
    init () {
      $('body').on('click', '.cancel-search', () => {
        this.hide()
      })
      $('body').on('click', '.search-recent-delete-view', () => {
        this.deleteHistory()
      })
      $('body').on('click', '.searchbar', () => {
        this.show()
      })
      this.searchange()

      $('body').on('click', '.search', () => {
        var inputVal = $('#view-input').val().trim()
        // alert(inputVal)
        this.searchVal(inputVal)
      })

      $('body').on('click', '.recent-history-list', (e) => {
        var val = $(e.currentTarget).html().trim()
        this.searchVal(val)
      })
      $('.search-recent-list-view .recent-history-list').on('click', (e) => {
        var val = $(e.currentTarget).html().trim()
        this.searchVal(val)
      })
      $('.btn-reset').on('click', () => {
        $('#view-input').val('')
        $('.cancel-button-view').removeClass('search')
        $('.cancel-button-view').addClass('cancel-search')
        $('.cancel-button-view').html('返回')
        $('.btn-reset').hide()
      })
    },
    show () {
      $('.search-view-container').css('visibility', 'visible')
      $('.search-view-container').css('display', 'block')
    },
    hide () {
      $('.search-view-container').css('visibility', 'hidden')
      $('.search-view-container').css('display', 'none')
    },
    searchange () {
      $('#view-input').bind('input propertychange', (e) => {
        var newval = $(e.currentTarget).val()
        if (newval.length > 0) {
          $('.cancel-button-view').addClass('search')
          $('.cancel-button-view').removeClass('cancel-search')
          $('.cancel-button-view').html('搜索')
          $('.btn-reset').show()
        } else {
          $('.cancel-button-view').removeClass('search')
          $('.cancel-button-view').addClass('cancel-search')
          $('.cancel-button-view').html('返回')
          $('.btn-reset').hide()
        }
      })
    },
    searchVal (val) {

    }
  }

  let Home = {
    pageInit: function () {
      search.init()
      this._getNewData()
      this.switch()
    },
    _temple: function (i, data) { // 模板
      let keyword = data[i].keyword.split(',')
      return `<div class="margin weui-panel weui-panel_access" id="${TYPE + data[i].id}">
      <div class="weui-panel__bd">
        <a href="club-detail.html?clubId=${data[i].id}" class="weui-media-box weui-media-box_appmsg">
          <div class="club-thumb weui-media-box__hd ">
            <img class="weui-media-box__thumb" src="${data[i].imgsrc}">
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
    _getNewData: function () {
      model.getClubData().then((data) => {
        let newdata
        let _html = ''
        // let src
        newdata = data[TYPE]
        if (newdata === null) {
          $('#club-grid').html(`<div class="nothing-text">
          <div class="nothing-club"></div>
          <p>暂时还没有俱乐部</p>
      </div>`)
        } else {
          let len = newdata.length
          $('#club-grid').append("<li class='goods_grid_wrapper stores' id=" + TYPE + ' data-type=' + TYPE + '></li>')
          for (let i = 0; i < len; i++) {
            _html = this._temple(i, newdata)
            $('#' + TYPE).append(_html)
          }
          $(document.getElementById(TYPE)).show().siblings().hide()
        }
      }).catch((ErrMsg) => {
        // 获取数据失败时的处理逻辑
        weui.alert(ErrMsg)
      })
    },
    switch: function () {
      $('.nav_fixed_catgoods').on('click', '.fixed_nav_item_catgoods', (e) => {
        $(e.currentTarget).find('span').addClass('nav_cur_cat').parent().siblings().find('span').removeClass('nav_cur_cat')
        TYPE = $(e.currentTarget).data('type')
        if (document.getElementById(TYPE)) {
          $(document.getElementById(TYPE)).show().siblings().hide()
        } else {
          this._getNewData()
        }
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
