import './addApplyOption.less'

import weui from 'weui.js'
import {Trim} from 'common/js/dom'
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
  applyItem: {}, // 保存添加的报名项
  init () {
    $('.button_addItem').on('click', (e) => {
      this.addOption(e.currentTarget)
    })

    $('.bakeInfo').on('click', '.button_removeItem', (e) => {
      this.removeOption(e.currentTarget)
    })

    $('.apply-option-show').on('click', (e) => {
      if ($('.apply-edit-list').is(':hidden')) {
        $('.apply-edit-list').show()
        $(e.currentTarget).addClass('apply-bake-opt')
      } else {
        $('.apply-edit-list').hide()
        $(e.currentTarget).removeClass('apply-bake-opt')
        $('.button_zjxx').unbind()
      }
    })
  },
  confirm () {
    let bakeInfo = ''
    let $info = $('#infoEdit .bakeInfo input')
    let len = $info.length
    if (Trim($('.apply-text').val(), 'g') !== '') {
      if ($('.apply-option-show').hasClass('apply-bake-opt')) { // 如果有候选项
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
      } else { // 如果没有候选项
        bakeInfo = ''
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

      $('.apply-options .col-33').not('.editDoing').each(function (i) {
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
      $('.apply-options .col-33').not('.editDoing').each(function (i) {
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
  hide (me) { // 隐藏新增项版面
    $('#applyOptions').hide()
    $('.apply-text,.apply-edit-list div :input').val('')
    $('.button_addItem').parents('li').siblings().remove()
    $(me) && $(me).removeClass('editDoing')
  }
}
let AddapplyOption = {}// 增加报名选项对象
let EditapplyOption = {}// 编辑报名选项对象
Object.setPrototypeOf(AddapplyOption, applyOption) // 这种更好更标准
Object.setPrototypeOf(EditapplyOption, applyOption)
EditapplyOption.Editinit = function () {
  $('.apply-options').on('click', '.edit-item', (e) => {
    this.Editshow(e.currentTarget)
  })
}
EditapplyOption.Editshow = function (me) { // me代表点击的报名选项
  let title = $(me).find('a').html()
  let child = $(me).find('a').attr('data-child').split(',') // 将data-child字符串转换成数组
  $(me).addClass('editDoing')// 代表正在编辑中
  let _thi = this// 代表该EditapplyOption对象
  $('.confirm').hide()
  $('.edit-comfirm').show()
  weui.actionSheet([
    {
      label: '编辑',
      onClick: function () {
        _thi.show()
        $('.edit-comfirm').off('click').on('click', () => { // 绑定编辑后的保存按钮事件
          _thi.Editcomfirm(me)
        })
        $('.cancel').off('click').on('click', () => {
          _thi.hide(me)
        })
        $('.addWay-title').find('h2').html('编辑填写项')
        $('.apply-text').val(title)
        $('.button_addItem').parents('li').siblings().remove()
        $('#infoEdit').attr('target-id', $(me).attr('id'))
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
        let key
        let sessionApply = JSON.parse(window.sessionStorage.getItem('applyItems'))
        let oldApplyName = $(me).find('a').text()
        $(me).remove()
        for (key in sessionApply) {
          if (key === oldApplyName) {
            delete sessionApply[key]// 删除老属性
            delete _thi.applyItem[oldApplyName]
          }
        }
        window.sessionStorage.setItem('applyItems', JSON.stringify(sessionApply))// 存储报名选项
      }
    }
  ], [
    {
      label: '取消',
      onClick: function () {
        $(me).removeClass('editDoing')
      }
    }
  ])
}
EditapplyOption.Editcomfirm = function (me) { // 当编辑的时候点击保存
  let _thi = this
  let _id = $('#infoEdit').attr('target-id')
  let oldApplyName = $('.editDoing').find('a').text()
  let applyName = $('.apply-text').val()
  let bakeInfo = this.confirm()
  let key
  let sessionApply = JSON.parse(window.sessionStorage.getItem('applyItems'))
  if (bakeInfo || bakeInfo.length === 0) {
    $(`#${_id}`).html(`<a class="bm-item apply-active" data-child=${bakeInfo}>${applyName}</a>`)

    for (key in sessionApply) {
      if (key === oldApplyName) {
        delete sessionApply[key]// 删除老属性
        delete _thi.applyItem[key]
        sessionApply[applyName] = bakeInfo.split(',')// 设置新属性
        _thi.applyItem[applyName] = bakeInfo.split(',')
      }
    }
    window.sessionStorage.setItem('applyItems', JSON.stringify(sessionApply))// 存储报名选项

    weui.alert('修改成功!', function () { _thi.hide(me) })
  }
}
AddapplyOption.Addshow = function () {
  if ($('.apply-options .col-33').length >= 11) {
    weui.alert('添加项目数量到达上限!')
  } else {
    this.show()
    $('.cancel').off('click').on('click', () => {
      this.hide()
    })
    // 新增报名填写项
    $('.addWay-title').find('h2').html('新增填写项')
    $('.confirm').show()
    $('.edit-comfirm').hide()
  }
}
AddapplyOption.Addconfirm = function () { // 新增报名项点击确定按钮
  let _thi = this

  let bakeInfo = this.confirm()
  let applyName = $('.apply-text').val()
  let index = $('.apply-options .col-33').length - 1
  let _html = `<li class="edit-item col-33" id=${'bm_' + index}>
            <a class="bm-item apply-active" data-child=${bakeInfo}>${applyName}</a>
        </li>`

  if (bakeInfo || bakeInfo.length === 0) {
    $('#addItem').before(_html)

    this.applyItem[applyName] = bakeInfo.split(',')
    let applyItems = JSON.stringify(this.applyItem)
    window.sessionStorage.setItem('applyItems', applyItems)// 存储报名选项
    weui.alert('添加成功', function () { _thi.hide() })
  }
}

AddapplyOption.Addinit = function () {
  this.init()
  let defaultArray = ['身份证号', '真实姓名']
  $('#addItem').on('click', () => {
    this.Addshow()
  })
  $('.apply-item').on('click', (e) => {
    if ($(e.currentTarget).find('.bm-item').hasClass('apply-active-only')) {
      return false
    } else {
      if ($(e.currentTarget).find('.bm-item').hasClass('apply-active')) {
        $(e.currentTarget).find('.bm-item').removeClass('apply-active')
        for (var i = 0; i < defaultArray.length; i++) {
          if (defaultArray[i] === $(e.currentTarget).find('.bm-item').html()) {
            defaultArray.splice(i, 1)
          }
        }
      } else {
        $(e.currentTarget).find('.bm-item').addClass('apply-active')
        defaultArray.push($(e.currentTarget).find('.bm-item').html())
      }
    }
    $('#defaultOptions').val(defaultArray)
    // console.log($('#defaultOptions').val())
  })
  $('.confirm').on('click', () => {
    this.Addconfirm()
  })
}

export {AddapplyOption, EditapplyOption}// 暴露对象
