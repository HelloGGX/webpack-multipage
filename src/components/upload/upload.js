import weui from 'weui.js'
import $ from 'jquery'
import {getQueryString} from 'common/js/dom'

let upload = {
  uploadCount: 0,
  uploadList: [],
  maxLength: 5,
  fileVal: 'imgfile',
  auto: true,
  size: 1,
  id: 'uploader',
  okCallBack: () => {},
  init (obj) {
    this._uploader(obj)
    this._seeImg()
  },
  _seeImg () { // 预览上传图片
    $('.uploaderFiles').on('click', (e) => {
      let target = e.target
      let _this = this
      while (!target.classList.contains('weui-uploader__file') && target) {
        target = target.parentNode
      }
      if (!target) return
      var url = target.getAttribute('style') || ''
      var id = target.getAttribute('data-id')

      if (url) {
        url = url.match(/url\((.*?)\)/)[1].replace(/"/g, '')
      }
      var gallery = weui.gallery(url, {

        className: 'custom-name',
        onDelete: function onDelete () {
          weui.confirm('确定删除该图片？', function () {
            --_this.uploadCount
            for (var i = 0, len = _this.uploadList.length; i < len; ++i) {
              var file = _this.uploadList[i]
              if (file.id === id) {
                file.stop()
                break
              }
            }
            target.remove()
            gallery.hide()
          })
        }
      })
    })
  },
  _uploader ({id = this.id, maxLength = this.maxLength, fileVal = this.fileVal, size = this.size, auto = this.auto, okCallBack = this.okCallBack} = {}) { // 上传图片
    let _this = this
    weui.uploader(`#${id}`, {
      url: 'http://125.65.111.19:82/api/getupload.php',
      auto: auto,
      type: 'file',
      fileVal: fileVal,
      compress: {
        width: 1600,
        height: 41800,
        quality: 0.8
      },
      onBeforeQueued: function (files) { // 文件添加前的回调，return false则不添加
        // `this` 是轮询到的文件, `files` 是所有文件

        if (['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].indexOf(this.type) < 0) {
          weui.alert('请上传图片')
          return false // 阻止文件添加
        }
        if (this.size > size * 1024 * 1024) {
          weui.alert(`请上传不超过${size}M的图片`)
          return false
        }
        if (files.length > maxLength) { // 防止一下子选择过多文件
          weui.alert(`最多只能上传${maxLength}张图片，请重新选择`)
          return false
        }
        if (_this.uploadCount + 1 > maxLength) {
          weui.alert(`最多只能上传${maxLength}张图片`)
          return false
        }

        ++_this.uploadCount

        // return true; // 阻止默认行为，不插入预览图的框架
      },
      onQueued: function () { // 文件添加成功的回调
        _this.uploadList.push(this)
        // console.log(this.status); // 文件的状态：'ready', 'progress', 'success', 'fail'
        // console.log(this.base64); // 如果是base64上传，file.base64可以获得文件的base64

        // this.upload() // 如果是手动上传，这里可以通过调用upload来实现；也可以用它来实现重传。
        // this.stop(); // 中断上传

        // return true; // 阻止默认行为，不显示预览图的图像
      },
      onBeforeSend: function (data, headers) { // 文件上传前调用
        // console.log(`文件上传前调用的data:${headers}`)
        $.extend(data, { albumId: getQueryString('albumId') }) // 可以扩展此对象来控制上传参数
        // $.extend(headers, { Origin: 'http://125.65.111.19:82' }) // 可以扩展此对象来控制上传头部
        console.log(`文件上传前调用的data:${data.albumId}`)
        // return false; // 阻止文件上传
      },
      onProgress: function (procent) {
        // console.log(this, procent)
        // return true; // 阻止默认行为，不使用默认的进度显示
      },
      onSuccess: function (ret) {
        $('#hdimg').val(ret.imgurl)
        weui.alert(`上传成功`)
        okCallBack()
        // return true; // 阻止默认行为，不使用默认的成功态
      },
      onError: function (err) {
        console.log(this, err)
        // return true; // 阻止默认行为，不使用默认的失败态
      }

    })
  },
  _customLoader () { // 手动上传按钮
    this.uploadList.map(file => {
      file.upload()
    })
  }

}

export {upload}
