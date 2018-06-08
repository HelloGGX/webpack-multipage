import './show-g-per.less'
import $ from 'jquery'
import {clear, Trim} from 'common/js/dom'
import weui from 'weui.js'
import model from 'api/getIndex'
import {moveToGroup} from 'components/moveToGroup/moveToGroup'

let showGroupPer = {
  GID: null, // 存储组id
  inputTemp (gname) {
    return `<div class="aler-input">
    <input type="text" name="gname" maxlength="40" value="${gname}">
    <div id="delGName" class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_default">删除</a></div>
    <div id="saveGName" class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
    </div>`
  },
  perTemp (data) {
    return ` <div data-gId='${data.group_id}' class="weui-cells margin class-lists">
      ${data.guest === null ? '' : data.guest.map(key => `<div class="class-item">
      <div class="weui-cell class-item-top">
          <div class="weui-cell__hd per-head"><img src=${require(`../../imgs/icons/${key.guest_sex === '男' ? 'boy' : 'girl'}.jpg`)} alt=""></div>
          <div class="weui-cell__bd">
          <p class="f-m per-name">${key.guest_name}</p>
          <p class="f-s per-bbname">${key.guest_type === '0' ? `发起人` : `${key.guest_typename}帮报`}</p>
          </div>
          <div class="weui-cell__ft">
          <p class="per-apply-cost">${key.guest_pricecl} ￥${key.guest_price}</p>
          <p class="per-pay-way">${key.guest_wxpay === '是' ? '微信支付' : ''}  ${key.guest_qtpay === '是' ? '其他支付方式' : ''}${(key.guest_wxpay === '否' && key.guest_qtpay === '否') ? `免费` : ``} ${key.guest_paystate === '1' ? `(已付款)` : `(未付款)`}</p>
          </div>      
      </div>
      <div class="moreInfo show" style="display: none;">
          <div class="moreInfo-top">
          <p>${key.guest_sex}</p>
          <p>${key.guest_tel}</p>
          </div>
          <div class="moreInfo-midd">
              ${key.guest_realname !== '' ? `<span>真实姓名：${key.guest_realname}</span>` : ''}
              ${key.guest_idcard !== '' ? `/<span>身份证号：${key.guest_idcard}</span>` : ''}
          </div>
          <div class="moreInfo-dowm">
              <a class="txt-green" href="tel:${key.guest_tel}">电话</a>
              <a class="txt-green btn-edit">编辑</a>
              <a class="text-red btn-move" data-id="${key.guest_id}">移动</a>
          </div>
      </div>
  </div>`)}
</div>`
  },

  showGroupPer (e) { // 初始化该组成员信息
    this.GID = $(e).attr('id')
    let _thi = this
    model.magAct.getGroupPer({groupId: _thi.GID}).then(data => {
      $('#groupPerContainer').html(clear(_thi.perTemp(data)))
    }).catch(errMsg => {
      console.log(errMsg)
    })
  },
  show () {
    $('#showGPer').show()
  },
  hide () {
    $('#showGPer').hide()
  },
  init () {
    $('#cancelG').on('click', () => {
      this.hide()
    })
    $('.g-lists').on('click', '.g-item', (e) => {
      $('#showGPer').find('.g-title').html($(e.currentTarget).find('.g-name p').text())
      this.showGroupPer(e.currentTarget)// 显示该组成员
      this.show()
    })
    $('#groupPerContainer').on('click', '.class-item-top', (e) => {
      $(e.currentTarget).next().toggle()
    })

    $('#groupPerContainer').on('click', '.btn-move', (e) => {
      let _thi = this
      moveToGroup({ perIdArr: [$(e.currentTarget).data('id')],
        okCallBack: () => {
          model.magAct.getGroupPer({groupId: _thi.GID}).then(data => {
            $('#groupPerContainer').html(clear(_thi.perTemp(data)))
          }).catch(errMsg => {
            console.log(errMsg)
          })
        }}).init()
    })

    $('#editGTitle').on('click', (e) => {
      let _thi = this
      require.ensure([], () => {
        require('vendor/dialog')
        $.alert.aler({
          title: '编辑分组',
          content: this.inputTemp(Trim($('#showGPer').find('.g-title').html(), 'g').match(/[\u4e00-\u9fa5_a-zA-Z0-9]+(?=\()/g)[0]),
          height: 'auto',
          blankclose: true,
          okCallback: function (e) {
            if ($(e.currentTarget).attr('id') === 'delGName') { // 如果是删除组
              _thi.deletGroup()
            } else if ($(e.currentTarget).attr('id') === 'saveGName') { // 如果是编辑组名
              _thi.editGroup()
            }
          }
        })
      }, 'aler')
    })
  },
  editGroup () {
    let _thi = this

    let groupName = $('input[name=gname]').val()
    if (groupName === '') {
      weui.alert('组名不能为空')
    } else {
      let groupId = $('#groupPerContainer').find('.class-lists').data('gid')
      model.magAct.editGroup({group_id: groupId, group_name: groupName}).then(res => {
        if (res.state === 'ok') {
          _thi.hide()
          moveToGroup({})._initActData()
          weui.alert('编辑组名成功')
        } else {
          weui.alert('编辑组名失败')
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    }
  },
  deletGroup () {
    let _thi = this
    let groupId = $('#groupPerContainer').find('.class-lists').data('gid')
    model.magAct.deletGroup({group_id: groupId}).then(res => {
      if (res.state === 'ok') {
        moveToGroup({})._initActData()
        _thi.hide()
        weui.alert('该组删除成功')
      } else {
        weui.alert('该组删除失败')
      }
    }).catch(errMsg => {
      weui.alert(errMsg)
    })
  },

  groupListTemp (data) {
    return `<div class="group-list">
      <ul>
        <li class="dialog-confirm">未分组<li>
        ${data.map((key) => `<li class="dialog-confirm" data-id="${key.id}">${key.innerText}</li>`)}
      </ul>
    </div>`
  }

}

export {showGroupPer}
