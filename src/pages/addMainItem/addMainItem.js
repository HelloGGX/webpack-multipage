/* jshint esversion: 6 */
import './addMainItem.less'
import $ from 'jquery'
import weui from 'weui.js'

let clubItem = {
  inputTemp: `<div class="aler-input">
  <input type="text" name="alerInput" maxlength="10" placeholder="创建我自己的主打项目">
  <div id="saveMyOwnItem" class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
  </div>`,

  itemArray: ['徒步'],
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
    $('.weui-check__label').click(() => {
      this.selected()
    })
    $('#addMainType').click(() => {
      $('#addClubMainItem').show()
    })
    $('#itemCancel').click(() => {
      $('#addClubMainItem').hide()
    })
  },
  selected () {
    let _thi = this
    this.itemArray = []
    $.each($('input[name=labelItem]:checkbox:checked'), function () {
      _thi.itemArray.push($(this).val())
    })
    console.log(_thi.itemArray)
  },
  saveItems () {
    weui.form.validate('.cover-form', (error) => {
      if (!error) {
        var loading = weui.loading('提交中...')
        setTimeout(() => {
          loading.hide()
          $('#addMainType').find('.weui-cell__ft').html(`
            ${this.itemArray.map(item => `
              <span>${item}</span>
            `)}
          `)
          $('input[name=majorType]').val(this.itemArray)
          weui.toast('提交成功', 1000)
          $('#addClubMainItem').hide()
        }, 800)
      }
    })
  },
  createItem () {
    let itemVal = $('input[name=alerInput]').val()
    $('#labelLists').prepend(`
    <label class="weui-cell weui-check__label">
    <div class="weui-cell__hd">
        <input type="checkbox" class="weui-check" name="labelItem"  checked="checked" value="${itemVal}">
        <i class="weui-icon-checked"></i>
    </div>
    <div class="weui-cell__bd">
        <p>${itemVal}</p>
    </div>
</label>
    `)
    this.selected()
  }

}
export {clubItem}
