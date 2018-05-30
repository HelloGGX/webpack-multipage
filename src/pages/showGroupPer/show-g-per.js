import './show-g-per.less'
import $ from 'jquery'
import {clear} from 'common/js/dom'
import weui from 'weui.js'

let showGroupPer = {

  inputTemp (gname) {
    return `<div class="aler-input">
    <input type="text" name="gname" maxlength="10" value="${gname}">
    <div id="delGName" class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_default">删除</a></div>
    <div id="saveGName" class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
    </div>`
  },
  init () {
    $('#cancelG').on('click', () => {
      $('#showGPer').hide()
    })

    $('.g-item').on('click', (e) => {
      $('#showGPer').show()
      $('#showGPer').find('.g-title').html($(e.currentTarget).find('.g-name p').text())
    })

    $('.class-item-top').on('click', (e) => {
      $(e.currentTarget).next().toggle()
    })

    $('.btn-move').on('click', (e) => {
      this.showGroup()
    })

    $('#editGTitle').on('click', (e) => {
      require.ensure([], () => {
        require('vendor/dialog')
        $.alert.aler({
          title: '编辑分组',
          content: this.inputTemp($('#showGPer').find('.g-title').html()),
          height: 'auto',
          blankclose: true,
          okCallback: function () {
            // 这里做插入到新分组，删除在未分组ajax的操作
            weui.alert('修改成功')
          }
        })
      }, 'aler')
    })
  },
  groupListTemp (data) {
    return `<div class="group-list">
      <ul>
        <li class="dialog-confirm">未分组<li>
        ${data.map((key) => `<li class="dialog-confirm" data-id="${key.id}">${key.innerText}</li>`)}
      </ul>
    </div>`
  },
  showGroup () {
    let gData = Array.from($('.g-item'))
    require.ensure([], () => {
      require('vendor/dialog')
      $.alert.aler({
        title: '分组到',
        content: clear(this.groupListTemp(gData)),
        height: 'auto',
        blankclose: true,
        okCallback: function () {
          // 这里做插入到新分组，删除在未分组ajax的操作
          weui.alert('移动成功')
        }
      })
    }, 'aler')
  }
}

export {showGroupPer}
