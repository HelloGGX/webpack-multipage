import './act-mag.less'
import 'components/banner/banner.less'
import 'components/tabs/tabs.less'
import $ from 'jquery'
import weui from 'weui.js'
import model from 'api/getIndex.js'

let all = (function () {
  let TYPE = 'createActs'
  let HREF
  let Home = {
    pageInit: function () {
      this.switch()
      this._getActMagData()
    },
    _createActTemple: function (i, data) { // 管理活动列表模板
      return `<div class="mag-item" id="${TYPE + data[i].act_id}">
      <div class="mag-item-content">
        <a href="${HREF}">
          <div class="mag-item-inner">
              <div class="mag-item-title-row" style="margin-bottom:0.1rem">
                  <div class="mag-item-title"><p>${data[i].act_name}</p></div>
              </div>
              <div class="mag-item-subtitle">
                  <span class="act_over">
                      ${data[i].act_state}
                  </span>
                  报名：${data[i].sales}人
              </div>
          </div>
          </a>
      </div>
  </div>`
    },
    _getApplyData () { // 获取报名信息
      model.getApplyInfo().then(data => {
        let newdata
        let _html = ''
        if (data[TYPE]) {
          newdata = data[TYPE]

          let len = newdata.length
          $('#acts-grid').append("<li class='mag-grid-wrapper' id=" + TYPE + ' data-type=' + TYPE + '></li>')
          $(document.getElementById(TYPE)).show().siblings().hide()
          for (let i = 0; i < len; i++) {
            HREF = `act-detail.html?id=${newdata[i].cp_id}`
            _html = this._createActTemple(i, newdata)
            $('#' + TYPE).append(_html)
          }
        } else {
          $('#acts-grid').html(`<div class="nothing-text">
          <div class="nothing-img"></div>
          <p>暂时还没有活动</p>
      </div>`)
        }
      }).catch(errMsg => {

      })
    },
    _getActMagData () { // 获取我创建的活动信息
      model.getActMagData().then((data) => {
        let newdata
        let _html = ''
        // let src
        if (data[TYPE]) {
          newdata = data[TYPE]
          let len = newdata.length
          $('#acts-grid').append("<li class='mag-grid-wrapper' id=" + TYPE + ' data-type=' + TYPE + '></li>')
          $(document.getElementById(TYPE)).show().siblings().hide()
          for (let i = 0; i < len; i++) {
            HREF = `act-info-mag.html?id=${newdata[i].act_id}`
            _html = this._createActTemple(i, newdata)
            $('#' + TYPE).append(_html)
          }
        } else {
          $('#acts-grid').html(`<div class="nothing-text">
          <div class="nothing-img"></div>
          <p>暂时还没有活动</p>
      </div>`)
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
          if (TYPE === 'createActs') {
            this._getActMagData()
          } else {
            this._getApplyData()
          }
        }
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
