import weui from 'weui.js'
import $ from 'jquery'
import {getQueryString} from 'common/js/dom'

export default class Upload {
  constructor ({id = 'uploader', customBtn = 'uploaderCustomBtn', urlArr = [], uploadCount = 0, uploadList = [], maxLength = 5, fileVal = 'imgfile', auto = true, size = 1, okCallBack = () => {}} = {}) {
    this.id = id
    this.uploadCount = uploadCount
    this.uploadList = uploadList
    this.maxLength = maxLength
    this.fileVal = fileVal
    this.auto = auto
    this.size = size
    this.okCallBack = okCallBack
    this.urlArr = urlArr
    this.customBtn = customBtn// 手动上传按钮id
  }
  init () {
    this._seeImg()
    this._uploader()
    $(`#${this.customBtn}`).on('click', (e) => {
      this._customLoader()
    })
  }
  _seeImg () { // 预览上传图片
    $('.uploaderFiles').on('click', (e) => {
      let target = e.target
      let _this = this
      while (!target.classList.contains('weui-uploader__file') && target) {
        target = target.parentNode
      }
      if (!target) return
      let url = target.getAttribute('style') || ''
      let id = target.getAttribute('data-id')

      if (url) {
        url = url.match(/url\((.*?)\)/)[1].replace(/"/g, '')
      }
      let gallery = weui.gallery(url, {

        className: 'custom-name',
        onDelete: function onDelete () {
          weui.confirm('确定删除该图片？', function () {
            --_this.uploadCount
            let len = $(`#${_this.id}`).find('.weui-uploader__file').length

            for (let j = 0; j < len; ++j) {
              if ($(target)[0].dataset === $($(`#${_this.id}`).find('.weui-uploader__file')[j])[0].dataset) {
                _this.urlArr.splice(j, 1)
              }
            }
            $(`#${_this.id}`).find('input').first().val(_this.urlArr)
            for (let i = 0, len = _this.uploadList.length; i < len; ++i) {
              let file = _this.uploadList[i]
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
  }
  _uploader () {
    let _this = this
    weui.uploader(`#${_this.id}`, {
      url: 'http://125.65.111.19:82/api/getupload.php',
      auto: _this.auto,
      type: 'file',
      fileVal: _this.fileVal,
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
        if (this.size > _this.size * 1024 * 1024) {
          weui.alert(`请上传不超过${_this.size}M的图片`)
          return false
        }
        if (files.length > _this.maxLength) { // 防止一下子选择过多文件
          weui.alert(`最多只能上传${_this.maxLength}张图片，请重新选择`)
          return false
        }
        if (_this.uploadCount + 1 > _this.maxLength) {
          weui.alert(`最多只能上传${_this.maxLength}张图片`)
          return false
        }

        ++_this.uploadCount

        // return true; // 阻止默认行为，不插入预览图的框架
      },
      onQueued: function () { // 文件添加成功的回调
        _this.uploadList.push(this)
        console.log(this)
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
        _this.urlArr.push(ret.imgurl)
        $(`#${_this.id}`).find('input').first().val(_this.urlArr)

        _this.okCallBack(ret)
        weui.alert(`上传成功`)

        // return true; // 阻止默认行为，不使用默认的成功态
      },
      onError: function (err) {
        console.log(this, err)
        // return true; // 阻止默认行为，不使用默认的失败态
      }

    })
  }
  _customLoader () { // 手动上传按钮
    console.log(this.uploadList)
    this.uploadList.map(file => {
      file.upload()
    })
  }
}
export function upload (opt) {
  return new Upload({
    id: opt.id,
    uploadCount: opt.uploadCount,
    uploadList: opt.uploadList,
    maxLength: opt.maxLength,
    fileVal: opt.fileVal,
    auto: opt.auto,
    size: opt.size,
    okCallBack: opt.okCallBack,
    urlArr: opt.urlArr,
    customBtn: opt.customBtn
  })
}
