import $ from 'jquery'
import model from 'api/getIndex'
import weui from 'weui.js'
import { imgSuffix } from 'common/js/dom'

class Search {
  constructor ({
    type = null// 搜索的类型
  } = {}) {
    this.type = type
  }
  // deleteHistory () { // 删除历史记录
  //     $('#search_item').html('')
  //     // localStorage.setItem('searchkey', '')
  // }
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

    // $('body').on('click', '.recent-history-list', (e) => {
    //   var val = $(e.currentTarget).html().trim()
    //   this.searchVal(val)
    // })
    // $('.search-recent-list-view .recent-history-list').on('click', (e) => {
    //   var val = $(e.currentTarget).html().trim()
    //   this.searchVal(val)
    // })
    $('.btn-reset').on('click', () => {
      $('#view-input').val('')
      $('.cancel-button-view').removeClass('search')
      $('.cancel-button-view').addClass('cancel-search')
      $('.cancel-button-view').html('返回')
      $('.btn-reset').hide()
    })
  }
  show () {
    $('.search-view-container').css('visibility', 'visible')
    $('.search-view-container').css('display', 'block')
  }
  hide () {
    $('.search-view-container').css('visibility', 'hidden')
    $('.search-view-container').css('display', 'none')
  }
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
  }
  _temple (i, data) { // 模板
    let keyword = data[i].keyword.split(',')
    return `<div class="margin weui-panel weui-panel_access" id="${data[i].id}">
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
  }
  searchVal (val) { // 搜索值调用api
    model.search({ val: val, type: this.type }).then(res => {
      if (res.state === 'ok') {
        let club = res.club
        let len = club.length
        for (let i = 0; i < len; i++) {
          $('#search-result').append(this._temple(i, club))
        }
      }
    }).catch(errMsg => {
      weui.alert(errMsg)
    })
  }
}
export function search (opt) {
  return new Search({
    type: opt.type
  })
}
