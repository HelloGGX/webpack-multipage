import './batch-group.less'
import $ from 'jquery'
import weui from 'weui.js'
import {clear} from 'common/js/dom'

let batchG = {
  len: $('.g-lists .g-item').length, // 分的组的个数
  inputTemp: `<div class="aler-input">
  <input type="text" name="alerInput" maxlength="10" placeholder="请输入组名">
  <div id="saveGroupName" class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
  </div>`,
  lists: Array.from($('input[name=labelItem]')),
  init () {
    $('#batchCancel').on('click', (e) => {
      this.hide()
    })
    $('.btn-batch').on('click', (e) => {
      this.show()
    })
    $('.batch-unclass-item').on('click', (e) => {
      this.selectItem(e.currentTarget)
    })
    $('#moveToNewG').on('click', (e) => {
      this.moveToGroup()
    })

    $('#addNewG').on('click', (e) => {
      this.addNewGroup()
    })
  },
  selectItem (e) {
    if ($(e).find('input[name=labelItem]').is(':checked')) {
      $(e).find('input[name=labelItem]').attr('checked', false)
    } else {
      $(e).find('input[name=labelItem]').attr('checked', true)
    }
  },
  groupListTemp (data) {
    console.log(data)
    return `<div class="group-list">
      <ul>
        ${data.map((key) => `<li class="dialog-confirm" data-id="${key.id}">${key.innerText}</li>`)}
      </ul>
    </div>`
  },
  showGroup () { // 显示有哪些分组
    let gData = Array.from($('.g-item'))
    require.ensure([], () => {
      require('vendor/dialog')
      $.alert.aler({
        title: '温馨提示',
        content: clear(this.groupListTemp(gData)),
        height: 190,
        blankclose: true,
        okCallback: function () {
          // 这里做插入到新分组，删除在未分组ajax的操作
          weui.alert('移动到分组成功')
        }
      })
    }, 'aler')
  },
  showAddGroup () { // 显示添加到分组
    require.ensure([], () => {
      require('vendor/dialog')
      $.alert.aler({
        title: '添加到分组',
        content: this.inputTemp,
        height: 190,
        blankclose: true,
        okCallback: function () {
          // 这里做插入到新分组，删除在未分组ajax的操作
          weui.alert('添加到新分组成功')
        }
      })
    }, 'aler')
  },
  moveToGroup () {
    let flag = false

    this.lists.map((key) => {
      if ($(key).is(':checked')) {
        flag = true
      }
    })
    if (flag) { // 如果有选中的
      if (this.len > 0) { // 判断有分组存在
        this.showGroup()
      } else { // 如果还没有分组
        this.showAddGroup()
      }
    } else {
      weui.alert('请先选择要分组的成员')
    }
  },
  addNewGroup () {
    let flag = false

    this.lists.map((key) => {
      if ($(key).is(':checked')) {
        flag = true
      }
    })
    if (flag) { // 如果有选中的
      this.showAddGroup()
    } else {
      weui.alert('请先选择要分组的成员')
    }
  },
  hide () {
    $('#setBatchGroup').hide()
  },
  show () {
    $('#setBatchGroup').show()
  }
}

export {batchG}
