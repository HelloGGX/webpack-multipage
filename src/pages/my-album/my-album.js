import './my-album.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import { imgSuffix } from 'common/js/dom'
import model from 'api/getIndex'
import weui from 'weui.js'

let all = (function () {
  class Album {
    init () {
      $('#createAlbums').on('click', () => {
        require.ensure([], () => {
          require('vendor/dialog')
          $.alert.aler({
            title: '提示',
            content: this.inputTemp(),
            height: 170,
            blankclose: true,
            okCallback: () => {
              this.createAlbum($('input[name=alerInput]').val())
            }
          })
        }, 'aler')
      })
      this.getAlbum()
    }
    getAlbum () {
      model.getAlbums().then(data => {
        let albums = data.albums
        let html = ''
        for (let item of albums) {
          html += this.albumTemp(item)
        }
        $('#albums').html(html)
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    }
    albumTemp (item) {
      return `<div class="margin weui-panel weui-panel_access">
        <div class="weui-panel__bd">
          <a href="my-album-create.html?albumId=${item.id}"  class="weui-media-box weui-media-box_appmsg">
            <div class="album-thumb  weui-media-box__hd" style="background-image:url(${imgSuffix(item.thumb, 2)})">
            </div>
            <div class="weui-media-box__bd">
              <h4 class="f-m album-tit weui-media-box__title">${item.name}</h4>
              <p class="weui-media-box__desc">${item.num}张</p>
            </div>
          </a>
        </div>
      </div> `
    }
    createAlbum (name) {
      model.postAlbum({ albumName: name }).then(res => {
        if (res.state === 'ok') {
          this.getAlbum()
          console.log(res)
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    }
    inputTemp () {
      return `<div class="aler-input">
        <input type="text" name="alerInput" maxlength="10" placeholder="请输入相册名">
        <div id="addAlbumName" class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">创建</a></div>
        </div>`
    }
  }
  let Home = {
    pageInit () {
      let album = new Album()
      album.init()
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
