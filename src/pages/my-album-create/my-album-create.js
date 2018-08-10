import './my-album-create.less'
import 'components/banner/banner.less'

import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import $ from 'jquery'
import weui from 'weui.js'
import {clear, transDate, getQueryString, imgSuffix} from 'common/js/dom'
import model from 'api/getIndex'
import {gallery} from 'components/gallery/gallery'

let all = (function () {
  // let DATA
  let magAlumb = {// 管理相册
    albums: [],
    init () {
      $('#magAlbum').on('click', () => {
        const _thi = this
        require.ensure([], () => {
          require('vendor/dialog')
          $.alert.aler({
            title: '温馨提示',
            content: this.magListTemp(),
            height: 160,
            blankclose: true,
            okCallback: function (e) {
              const id = $(e.currentTarget).attr('id')
              if (id === 'delete') { // 当选择了删除相册
                _thi.selectDele()
              }
            }
          })
        }, 'aler')
      })
      $('#cancelMagAlbum').on('click', () => {
        this.cancelMag()
      })
      $('#album-container').on('click', '.mag-photos li', (e) => {
        this.selectAlbum(e)
      })
      $('.btn-delete-comfirm').on('click', () => {
        this.deleteAlbums()
      })
    },
    magListTemp () {
      return `<div class="group-list">
        <ul>
          <li id="delete" class="dialog-confirm">批量删除<li>
        </ul>
      </div>`
    },
    selectDele () { // 当选择批量删除
      $('.album-photos').addClass('mag-photos').removeClass('album-photos')
      $('.btn-delete-comfirm').show()
      $('#BtnUpload').hide()
      $('#cancelMagAlbum').show()
      $('#magAlbum').hide()
    },
    cancelMag () { // 当选择取消
      $('.mag-photos').addClass('album-photos').removeClass('mag-photos')
      $('.btn-delete-comfirm').hide()
      $('#BtnUpload').show()
      $('#cancelMagAlbum').hide()
      $('#magAlbum').show()
    },
    selectAlbum (e) { // 选择相册
      let src = $(e.currentTarget).find('img').attr('src')
      if ($(e.currentTarget).hasClass('del')) {
        $(e.currentTarget).removeClass('del')
        this.albums.splice(this.albums.findIndex(item => item === src), 1)
      } else {
        $(e.currentTarget).addClass('del')
        this.albums.push(src)
      }
      console.log(this.albums)
    },
    deleteAlbums () {
      model.deleteAlbums({albumId: getQueryString('albumId'), albums: this.albums}).then(res => {
        if (res.state === 'ok') {
          weui.alert('删除成功')
          this.cancelMag()
          Home.getMyAlbumData()
        }
      }).catch(errmsg => {
        weui.alert(errmsg)
      })
    }
  }
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
      let _thi = this
      $('#uploadPage').show()
      upload({maxLength: 5,
        size: 3,
        auto: false,
        id: 'uploader',
        customBtn: 'uploaderCustomBtn',
        type: 'titbits',
        okCallBack: () => {
          _thi.hide()
          window.location.reload()
        }})
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
      <div  class="album-photos">
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
      magAlumb.init()
      this.getMyAlbumData()
    },
    getMyAlbumData () {
      model.getMyAlbumData({albumId: getQueryString('albumId')}).then((data) => {
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
