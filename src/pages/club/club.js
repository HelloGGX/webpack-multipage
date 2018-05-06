import './club.less'
import '../../components/tabs.less'
import '../../components/banner.less'
import $ from 'jquery'
import {getClubData} from '../../api/getIndex'

let all = (function () {
  let TYPE = 'city'

  let search = {// 搜索框显示及查询
    deleteHistory () { // 删除历史记录
      $('#search_item').html('')
      // localStorage.setItem('searchkey', '')
    },
    init () {
      var e = this
      $('body').on('click', '.cancel-search', function () {
        e.hide()
      })
      $('body').on('click', '.search-recent-delete-view', function () {
        e.deleteHistory()
      })
      $('body').on('click', '.searchbar', function () {
        e.show()
      })
      this.searchange()
      $('body').on('click', '.search', function () {
        var inputVal = $('#view-input').val().trim()
        // alert(inputVal)
        e.searchVal(inputVal)
      })

      $('body').on('click', '.recent-history-list', function () {
        var val = $(this).html().trim()

        e.searchVal(val)
      })
      $('.search-recent-list-view .recent-history-list').on('click', function () {
        var val = $(this).html().trim()

        e.searchVal(val)
      })
      $('.btn-reset').on('click', function () {
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
      $('#view-input').bind('input propertychange', function () {
        var newval = $(this).val()
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
    },
    _temple: function (i, data) { // 模板
      return `<div class="weui-panel weui-panel_access">
      <div class="weui-panel__bd">
        <a href="javascript:void(0);" class="weui-media-box weui-media-box_appmsg">
          <div class="weui-media-box__hd">
            <img class="weui-media-box__thumb" src="">
          </div>
          <div class="weui-media-box__bd">
            <h4 class="weui-media-box__title">标题一</h4>
            <p class="weui-media-box__desc">由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。</p>
          </div>
        </a>
      </div>
    </div>`
    },
    _getNewData: function () {
      getClubData().then(function (data) {
        let newdata
        let _html = ''
        newdata = data[TYPE]
        let len = newdata.length
        for (let i = 0; i < len; i++) {
          _html += Home._temple(i, newdata)
        }
        $('#club-grid').append("<li class='goods_grid_wrapper stores' id=" + TYPE + ' data-type=' + TYPE + '></li>')
        $('#' + TYPE).append(_html)
        $(document.getElementById(TYPE)).show().siblings().hide()
      }).catch(function (ErrMsg) {
        // 获取数据失败时的处理逻辑
      })
    }
  }

  return Home
}())

$(function () {
  all.pageInit()
})
