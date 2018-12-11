import './act-album.less'
import 'components/banner/banner.less'

import { upload } from 'components/upload/upload'// 引入上传图片对象方法
import $ from 'jquery'
import weui from 'weui.js'
import { clear, transDate, getQueryString, imgSuffix } from 'common/js/dom'
import model from 'api/getIndex'
import { gallery } from 'components/gallery/gallery'
import { judgeLogin } from 'components/judgeLogin/judge-login'

let all = (function () {
  // let DATA
  let uploadAlumb = {
    init () {
      $('#BtnUpload').on('click', () => {
        let _thi = this
        judgeLogin(
          () => { _thi.show() },
          () => {
            weui.confirm('请登陆再上传~', {
              title: '提示',
              buttons: [{
                label: '取消',
                type: 'default',
                onClick: function () { console.log('no') }
              }, {
                label: '马上登陆',
                type: 'primary',
                onClick: function () { window.location.href = 'login.html' }
              }]
            })
          })
      })

      $('#uploadCancel').on('click', () => {
        this.hide()
      })
    },
    show () {
      let _thi = this
      $('#uploadPage').show()
      upload({ maxLength: 5,
        size: 3,
        auto: false,
        id: 'uploader',
        customBtn: 'uploaderCustomBtn',
        okCallBack: () => {
          _thi.hide()
          window.location.reload()
        } })
    },
    hide () {
      $('#uploadPage').hide()
    }
  }
  let Home = {
    albumTemp (i, data) {
      return `<div class="album-item" data-id="${data[i].id}">
      <div class="album-time">
          <p>${transDate(data[i].time)}</p>
      </div>
      <div class="album-photos">
          <ul class="clearfix" data-album="${i}">
            ${data[i].url.map(key => `
            <li>
              <div class="album-photo">
                  <img src="${imgSuffix(key, 2)}" alt="">
              </div>
          </li>
            `)}
          </ul>
      </div>
  </div>`
    },
    pageInit: function () {
      uploadAlumb.init()
      this._getAlbumData()
    },
    _getAlbumData () {
      model.getAlbumData({ albumId: getQueryString('albumId') }).then((data) => {
        let newdata
        let _html = ''
        newdata = data['albums']
        // DATA = newdata
        gallery.init(newdata)
        let len = newdata.length
        for (let i = 0; i < len; i++) {
          _html += clear(this.albumTemp(i, newdata))
        }
        $('#album-container').html(_html)
        $('.album-photos li').css('height', $('.album-photos li').width())
      }).catch((errmsg) => {
        weui.alert(errmsg)
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
