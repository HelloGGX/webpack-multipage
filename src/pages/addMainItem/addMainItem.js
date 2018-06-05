/* jshint esversion: 6 */
import './addMainItem.less'
import $ from 'jquery'
import weui from 'weui.js'
import {clear} from 'common/js/dom'

let clubItem = {
  inputTemp: `<div class="aler-input">
  <input type="text" name="alerInput" maxlength="10" placeholder="创建我自己的主打项目">
  <div id="saveMyOwnItem" class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
  </div>`,
  itemArray: [],
  elem: null,
  initTemp (e, arrItems) {
    this.show()
    this.elem = e
    $('#labelLists').html(clear(this._itemTemp(arrItems)))
  },
  init () {
    $('#itemSave').on('click', () => {
      this.saveItems(this.elem)
    })
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

    $('#labelLists').on('click', '.weui-check__label', () => {
      this.selected()
    })

    $('#itemCancel').on('click', () => {
      this.hide()
    })
  },
  show () {
    $('#addClubMainItem').show()
  },
  hide () {
    $('#addClubMainItem').hide()
  },
  _itemTemp (data) {
    return `${data.map((key, i) => `
    <label class="weui-cell weui-check__label">
    <div class="weui-cell__hd">
        <input type="checkbox" class="weui-check" name="labelItem" value="${key}"  ${i === 0 ? 'checked="checked"' : ''}>
        <i class="weui-icon-checked"></i>
    </div>
    <div class="weui-cell__bd">
        <p>${key}</p>
    </div>
</label>
    `)}`
  },
  selected () {
    let _thi = this
    this.itemArray = []
    $.each($('input[name=labelItem]:checkbox:checked'), function () {
      _thi.itemArray.push($(this).val())
    })
  },
  saveItems (e) {
    if (this.itemArray.length <= 3 && this.itemArray.length > 0) {
      var loading = weui.loading('提交中...')
      setTimeout(() => {
        loading.hide()
        $(e.currentTarget).find('.weui-cell__ft').html(`
            ${this.itemArray.map(item => `
              <span>${item}</span>
            `)}
          `)
        $(e.currentTarget).find('input').first().val(this.itemArray)
        weui.toast('提交成功', 1000)
        $('#addClubMainItem').hide()
      }, 800)
    } else {
      weui.alert('请勾选1-3个主打项目')
    }
  },
  createItem () {
    let itemVal = $('input[name=alerInput]').val()
    $('#labelLists').prepend(`
    <label class="weui-cell weui-check__label">
    <div class="weui-cell__hd">
        <input type="checkbox" class="weui-check" name="labelItem"   checked="checked" value="${itemVal}">
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
