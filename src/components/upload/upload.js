import weui from 'weui.js'
import $ from 'jquery'
import {getQueryString} from 'common/js/dom'

class Upload {
  constructor ({
    id = 'uploader',
    customBtn = 'uploaderCustomBtn',
    urlArr = [],
    uploadCount = $(`#${id}`).find('.weui-uploader__file').length === 0 ? 0 : $(`#${id}`).find('.weui-uploader__file').length,
    uploadList = [],
    maxLength = 5,
    fileVal = 'imgfile',
    auto = true,
    size = 1,
    type = 'act',
    okCallBack = () => {}} = {}) {
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
    this.type = type
  }
  init () {
    this._seeImg()
    this._uploader()
    console.log(this.uploadCount)
    $(`#${this.customBtn}`).on('click', (e) => {
      this._customLoader()
    })
  }
  _seeImg () { // 预览上传图片
    $(`#${this.id} .uploaderFiles`).on('click', (e) => {
      let target = e.target
      let _thi = this

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
            let len = $(`#${_thi.id}`).find('.weui-uploader__file').length

            for (let j = 0; j < len; ++j) {
              if ($(target)[0].dataset === $($(`#${_thi.id}`).find('.weui-uploader__file')[j])[0].dataset) {
                _thi.urlArr.splice(j, 1)
              }
            }
            $(`#${_thi.id}`).find('input').first().val(_thi.urlArr)
            for (let i = 0, len = _thi.uploadList.length; i < len; ++i) {
              let file = _thi.uploadList[i]
              if (file.id === id) {
                file.stop()
                break
              }
            }
            target.remove()

            --_thi.uploadCount

            gallery.hide()
          })
        }
      })
    })
  }
  _uploader () {
    let _thi = this
    weui.uploader(`#${_thi.id}`, {
      url: 'http://www.shanduhuwai.com/api/getupload.php',
      auto: _thi.auto,
      type: 'file',
      fileVal: _thi.fileVal,
      compress: {
        width: 1600,
        height: 41800,
        quality: 0.8
      },
      onBeforeQueued: function (files) { // 文件添加前的回调，return false则不添加
        // `this` 是轮询到的文件, `files` 是所有文件
        console.log(_thi.uploadCount)
        if (['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].indexOf(this.type) < 0) {
          weui.alert('请上传图片')
          return false // 阻止文件添加
        }
        if (this.size > _thi.size * 1024 * 1024) {
          weui.alert(`请上传不超过${_thi.size}M的图片`)
          return false
        }
        if (files.length > _thi.maxLength) { // 防止一下子选择过多文件
          weui.alert(`最多只能上传${_thi.maxLength}张图片，请重新选择`)
          return false
        }
        if (_thi.uploadCount + 1 > _thi.maxLength) {
          weui.alert(`最多只能上传${_thi.maxLength}张图片`)
          return false
        }

        ++_thi.uploadCount

        // return true; // 阻止默认行为，不插入预览图的框架
      },
      onQueued: function () { // 文件添加成功的回调
        _thi.uploadList.push(this)
        console.log(this)
        // console.log(this.status); // 文件的状态：'ready', 'progress', 'success', 'fail'
        // console.log(this.base64); // 如果是base64上传，file.base64可以获得文件的base64

        // this.upload() // 如果是手动上传，这里可以通过调用upload来实现；也可以用它来实现重传。
        // this.stop(); // 中断上传

        // return true; // 阻止默认行为，不显示预览图的图像
      },
      onBeforeSend: function (data, headers) { // 文件上传前调用
        // console.log(`文件上传前调用的data:${headers}`)
        const albumType = _thi.type

        $.extend(data, { albumId: getQueryString('albumId'), type: albumType }) // 可以扩展此对象来控制上传参数
        // $.extend(headers, { Origin: 'http://125.65.111.19:82' }) // 可以扩展此对象来控制上传头部
        console.log(`文件上传前调用的data:${data.albumId}`)
        // return false; // 阻止文件上传
      },
      onProgress: function (procent) {
        // console.log(this, procent)
        // return true; // 阻止默认行为，不使用默认的进度显示
      },
      onSuccess: function (ret) {
        _thi.urlArr.push(ret.imgurl)
        console.log(ret)
        $(`#${_thi.id}`).find('input').first().val(_thi.urlArr)

        _thi.okCallBack(ret)
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
    customBtn: opt.customBtn,
    type: opt.type
  }).init()
}
