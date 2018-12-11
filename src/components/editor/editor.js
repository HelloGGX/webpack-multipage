import E from 'wangeditor' // 使用 npm 安装

class Editor {
  constructor ({
    uploadImgShowBase64 = true,
    showLinkImg = false,
    uploadImgMaxSize = 3,
    uploadImgMaxLength = 5,
    pasteFilterStyle = false,
    zIndex = 100,
    editorObj = null
  } = {}) {
    this.uploadImgShowBase64 = uploadImgShowBase64
    this.showLinkImg = showLinkImg
    this.uploadImgMaxSize = uploadImgMaxSize
    this.uploadImgMaxLength = uploadImgMaxLength
    this.pasteFilterStyle = pasteFilterStyle
    this.zIndex = zIndex
    this.editorObj = editorObj
  }

  init () {
    this.editorObj = new E('#editor')
    let _thi = this
    this.editorObj.customConfig = {
      menus: [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'undo', // 撤销
        'redo' // 重复
      ],
      uploadImgShowBase64: this.uploadImgShowBase64,
      showLinkImg: this.showLinkImg,
      uploadImgMaxSize: this.uploadImgMaxSize * 1024 * 1024,
      uploadImgMaxLength: this.uploadImgMaxLength,
      pasteFilterStyle: this.pasteFilterStyle,
      uploadImgHooks: _thi._upload,
      zIndex: this.zIndex,
      pasteTextHandle: function (content) {
        // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
        return content + '<p></p>'
      }
      //   onfocus: function () {
      //     console.log(editor)

    //     // _thi.fixbug(editor)
    //   }
    }
    this.editorObj.create()
    return this.editorObj
  }
  _upload () {
    let uploadImgHooks = {
      before: function (xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function (xhr, editor, result) {
        // 图片上传并返回结果，图片插入成功之后触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      fail: function (xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function (xhr, editor) {
        // 图片上传出错时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function (xhr, editor) {
        // 图片上传超时时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },

      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function (insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

        // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
        var url = result.url
        insertImg(url)

        // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    }
    return uploadImgHooks
  }
}
export function editor (opt) {
  return new Editor({
    uploadImgShowBase64: opt.uploadImgShowBase64,
    showLinkImg: opt.showLinkImg,
    uploadImgMaxSize: opt.uploadImgMaxSize,
    uploadImgMaxLength: opt.uploadImgMaxLength,
    pasteFilterStyle: opt.pasteFilterStyle
  })
}
