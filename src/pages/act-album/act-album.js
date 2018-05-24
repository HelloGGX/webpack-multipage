import './act-album.less'
import 'components/banner/banner.less'

import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import $ from 'jquery'
import {clear, transDate, getQueryString} from 'common/js/dom'
import model from 'api/getIndex'
import {gallery} from 'components/gallery/gallery'

let all = (function () {
  let DATA
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
          <p>${transDate(data[i].time)}</p>
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
      $('#album-container').on('click', '.album-photos li', (e) => {
        gallery.init(DATA, e)
      })
    },
    _getAlbumData () {
      model.getAlbumData({albumId: getQueryString('albumId')}).then((data) => {
        let newdata
        let _html = ''
        newdata = data['albums']
        DATA = newdata

        let len = newdata.length
        for (let i = 0; i < len; i++) {
          _html = clear(this.albumTemp(i, newdata))
          $('#album-container').append(_html)
        }

        $('.album-photos li').css('height', $('.album-photos li').width())
      }).catch((errmsg) => {

      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
