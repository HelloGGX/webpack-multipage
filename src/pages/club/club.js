import './club.less'
import $ from 'jquery'

let all = (function () {
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
    }
  }

  return Home
}())

$(function () {
  all.pageInit()
})
