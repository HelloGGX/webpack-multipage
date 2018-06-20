import model from 'api/getIndex'
import $ from 'jquery'
import weui from 'weui.js'
import {getQueryString, Trim, clear} from 'common/js/dom'

class MoveToGroup {
  // targetelem代表选中的目标元素
  // perIdArr代表选中的游客id所组成的数组
  // okCallBack 代表移动到组成功后的回调函数
  constructor ({perIdArr = [], okCallBack = () => {}} = {}) {
    this.perIdArr = perIdArr
    this.okCallBack = okCallBack
  }
  init () {
    this.showGroup()
  }
  groupListTemp (data, len) { // 组列表模板
    return `<div class="group-list">
      <ul>
        ${data.map((key) => `<li class="dialog-confirm" data-id="0">未分组(${len})</li><li class="dialog-confirm" data-id="${key.id}">${key.innerText}</li>`)}
      </ul>
    </div>`
  }
  showGroup () { // 显示有哪些分组
    let gData = Array.from($('.g-item'))
    let len = $('.unclass-item').length
    let _thi = this
    require.ensure([], () => {
      require('vendor/dialog')
      $.alert.aler({
        title: '温馨提示',
        content: clear(this.groupListTemp(gData, len)),
        height: 'auto',
        blankclose: true,
        okCallback: function (e) {
          _thi._moveToGroupData(e)
        }
      })
    }, 'aler')
  }
  _moveToGroupData (e) { // 移动到已有分组
    let _thi = this
    let groupName = Trim($(e.currentTarget).html(), 'g').match(/[\u4e00-\u9fa5_a-zA-Z0-9]+(?=\()/g)[0]
    let groupId = $(e.currentTarget).data('id')
    // let perId =

    model.magAct.moveToGroup({id: getQueryString('id'), groupId: groupId, groupName: groupName, perId: this.perIdArr}).then(res => {
      if (res.state === 'ok') {
        weui.alert('移动到分组成功')
        _thi.okCallBack()
      }
    }).catch(errMsg => {
      console.log(errMsg)
    })
  }
}

export function moveToGroup (opt) {
  return new MoveToGroup({
    perIdArr: opt.perIdArr,
    okCallBack: opt.okCallBack
  })
}
