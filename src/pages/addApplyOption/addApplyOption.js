import './addApplyOption.less'

import weui from 'weui.js'
import {Trim} from '../../common/js/dom'
import $ from 'jquery'

let applyOption = {
  ItemHt: `<li>
    <div class="item-content">
        <div class="item-media removeIcon button_removeItem">
            <span class=""><img src=${require(`../../imgs/icons/removeIcon.png`)} alt=""></span>
        </div>
        <div class="item-inner">
            <div class="item-title  entered-input">
                <input maxlength="10" type="text" placeholder="请输入候选项" style="text-align:left" class="">
            </div>
        </div>
    </div>
</li>`,
  init () {
    $('.cancel').on('click', () => {
      this.hide()
    })

    $('.button_addItem').on('click', (e) => {
      this.addOption(e.currentTarget)
    })

    $('.bakeInfo').on('click', '.button_removeItem', (e) => {
      this.removeOption(e.currentTarget)
    })
  },
  confirm () {
    let bakeInfo = ''
    let $info = $('#infoEdit .bakeInfo input')
    let len = $info.length
    if (Trim($('.apply-text').val(), 'g') !== '') {
      // 遍历获取相关的候选项信息
      for (let m = 0; m < len; m++) {
        if (Trim($($info[m]).val(), 'g') === '') {
          weui.alert(`第${m + 1}项候选项没有填写哦`)
          bakeInfo = false
          break
        } else {
          bakeInfo += Trim($($info[m]).val(), 'g')// 去掉所有的空格
          if (m < len - 1) {
            bakeInfo += ','
          }
        }
      }
      if (bakeInfo) {
        if (bakeInfo.substring(bakeInfo.length - 1) === ',') {
          bakeInfo = bakeInfo.substring(0, bakeInfo.lastIndexOf(','))
        }
      }
    } else {
      weui.alert(`报名主选项还没有填写哦`)
      return false
    }

    if ($('.apply-text').val().length > 10) {
      weui.alert('请输入最多10个描述字符')
      return false
    }
    if (this._checkOptions($('.apply-text').val(), false)) { // 检查添加的报名项是否有重复的
      weui.alert('该填写项已经存在')
      bakeInfo = false
    }
    return bakeInfo
  },
  _checkOptions (itemName, flag) { // 检查添加的报名项是否有重复的
    var isFlag = false
    if (flag) {
      var i = 0
      $('.apply-options .apply-item').each(function (i) {
        let item = $(this).find('.bm-item')
        let opName = item.html()
        if (Trim(opName, 'g') === Trim(itemName, 'g')) {
          i += 1
        }
      })
      if (i > 1) {
        isFlag = true // 有重复为true
      }
    } else {
      $('.apply-options .apply-item').each(function (i) {
        var item = $(this).find('.bm-item')
        var opName = item.html()
        if (Trim(opName, 'g') === Trim(itemName, 'g')) {
          isFlag = true
        }
      })
    }
    return isFlag
  },
  addOption (me) { // 增加报名候选项
    if ($('.bakeInfo').find('li').length > 6) {
      weui.alert('最多只能添加8个选项')
    } else {
      $(me).parents('li').before(this.ItemHt)
    }
  },
  removeOption (me) { // 减少报名候选项版面
    $(me).parents('li').remove()
    $('.button_removeItem').unbind()
  },
  show () { // 显示新增项
    $('#applyOptions').show()
  },
  hide () { // 隐藏新增项版面
    $('#applyOptions').hide()
    $('.apply-text,.apply-edit-list div :input').val('')
    $('.button_addItem').parents('li').siblings().remove()
  }
}
let AddapplyOption = {}// 增加报名选项对象
let EditapplyOption = {}// 编辑报名选项对象
Object.setPrototypeOf(AddapplyOption, applyOption) // 这种更好更标准
Object.setPrototypeOf(EditapplyOption, applyOption)
EditapplyOption.Editinit = function () {
  $('.apply-options').on('click', '.edit-item', (e) => {
    this.Editshow($(e.currentTarget))
  })

  $('.edit-comfirm').on('click', (e) => { // 绑定编辑按钮的事件
    this.Editcomfirm()
  })
}
EditapplyOption.Editshow = function (me) { // me代表点击的报名选项
  let title = $(me).find('a').html()
  let child = $(me).find('a').attr('data-child').split(',') // 将data-child字符串转换成数组
  let _thi = this// 代表该EditapplyOption对象
  $('.confirm').hide()
  $('.edit-comfirm').show()
  weui.actionSheet([
    {
      label: '编辑',
      onClick: function () {
        _thi.show()
        $('.addWay-title').find('h2').html('编辑填写项')
        $('.apply-text').val(title)
        $('.button_addItem').parents('li').siblings().remove()
        $('#infoEdit').attr('target-id', me.attr('id'))
        for (var z = 0; z < child.length; z++) {
          $('.bakeInfo').prepend(`<li>
            <div class="item-content">
                <div class="item-media removeIcon button_removeItem">
                    <span class=""><img src=${require(`../../imgs/icons/removeIcon.png`)} alt=""></span>
                </div>
                <div class="item-inner">
                    <div class="item-title  entered-input">
                        <input value="${child[z]}" maxlength="10" type="text" placeholder="请输入候选项" style="text-align:left" class="">
                    </div>
                </div>
            </div>
        </li>`) // 将已经添加的信息添加到候选项中进行编辑
        }
      }
    }, {
      label: '删除',
      onClick: function () {
        me.remove()
      }
    }
  ], [
    {
      label: '取消',
      onClick: function () {

      }
    }
  ])
}
EditapplyOption.Editcomfirm = function () {
  let bakeInfo = this.confirm()
  let _thi = this
  var _id = $('#infoEdit').attr('target-id')
  if (bakeInfo) {
    $(`#${_id}`).html(`<a class="bm-item apply-active" data-child=${bakeInfo}>${$('.apply-text').val()}</a>`)
    weui.alert('修改成功!', function () { _thi.hide() })
  }
}
AddapplyOption.Addshow = function () {
  if ($('.apply-options .apply-item').length >= 11) {
    weui.alert('添加项目数量到达上限!')
  } else {
    this.show()
    // 新增报名填写项
    $('.addWay-title').find('h2').html('新增填写项')
    $('.confirm').show()
    $('.edit-comfirm').hide()
  }
}
AddapplyOption.Addconfirm = function () { // 新增报名项点击确定按钮
  let _thi = this
  let bakeInfo = this.confirm()

  let index = $('.apply-options .apply-item').length - 1
  let _html = `<li class="apply-item col-33 edit-item" id=${'bm_' + index}>
            <a class="bm-item apply-active" data-child=${bakeInfo}>${$('.apply-text').val()}</a>
        </li>`

  if (bakeInfo) {
    $('#addItem').before(_html)
    weui.alert('添加成功', function () { _thi.hide() })
  }
}

AddapplyOption.Addinit = function () {
  this.init()

  $('#addItem').on('click', () => {
    this.Addshow()
  })

  $('.confirm').on('click', () => {
    this.Addconfirm()
  })
}

export {AddapplyOption, EditapplyOption}// 暴露对象
