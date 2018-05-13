import './addMainItem.less'
import $ from 'jquery'
import weui from 'weui.js'

let clubItem = {
  inputTemp: `<div class="aler-input">
  <input type="text" name="alerInput" maxlength="10" placeholder="创建我自己的主打项目">
  <div id="saveMyOwnItem" class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
  </div>`,
  init () {
    $('#createMyType').on('click', (e) => {
      require.ensure([], () => {
        require('vendor/dialog')
        $.alert.aler({
          title: '提示',
          content: this.inputTemp,
          height: 170,
          blankclose: true
        })
      }, 'aler')
    })

    $('body').on('click', '#saveMyOwnItem', () => {
      this.createItem()
    })
    $('#itemSave').on('click', () => {
      this.saveItems()
    })
  },
  selected () {

  },
  saveItems () {
    weui.form.validate('.cover-form', function (error) {
      console.log(error)
      if (!error) {
        var loading = weui.loading('提交中...')

        setTimeout(function () {
          loading.hide()
          weui.toast('提交成功', 3000)
        }, 800)
      }
    })
  },
  createItem () {
    let itemVal = $('input[name=alerInput]').val()
    $('#labelLists').prepend(`
    <label class="weui-cell weui-check__label">
    <div class="weui-cell__hd">
        <input type="checkbox" class="weui-check" name="labelItem"  checked="checked">
        <i class="weui-icon-checked"></i>
    </div>
    <div class="weui-cell__bd">
        <p>${itemVal}</p>
    </div>
</label>
    `)
  }
}
export {clubItem}
