import './act-album.less'
import 'components/banner/banner.less'

import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import $ from 'jquery'
import {clear} from 'common/js/dom'
import model from 'api/getIndex'

let all = (function () {
  let uploadAlumb = {
    init () {
      $('#BtnUpload').on('click', () => {
        this.show()
      })

      $('#uploadCancel').on('click', () => {
        this.hide()
      })
    },
    show () {
      $('#uploadPage').show()

      upload.init({maxLength: 5,
        fileVal: 'imgfile',
        auto: false,
        okCallBack: () => {
          this.hide()
        }
      })// 手动上传照片
    },
    hide () {
      $('#uploadPage').hide()
    }
  }
  let Home = {
    albumTemp (i, data) {
      return `<div class="album-item" data-id="${data[i].id}">
      <div class="album-time">
          <p>${data[i].time}</p>
      </div>
      <div class="album-photos">
          <ul class="clearfix">
            ${data[i].url.map(key => `
            <li>
              <div class="album-photo">
                  <img src="${key}" alt="">
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
      $('.album-photos li').css('height', $('.album-photos li').width())
    },
    _getAlbumData () {
      model.getAlbumData().then((data) => {
        let newdata
        let _html = ''
        newdata = data['albums']

        let len = newdata.length
        for (let i = 0; i < len; i++) {
          _html = clear(this.albumTemp(i, newdata))
          console.log(_html)
          $('#album-container').append(_html)
        }
      }).catch((errmsg) => {

      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
