import './travel-release.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import weui from 'weui.js'
import { editor } from 'components/editor/editor' // 使用 npm 安装
import { upload } from 'components/upload/upload'// 引入上传图片对象方法
import { clear } from 'common/js/dom'// 这里如果改回来记得加上jugePhone
import model from 'api/getIndex'

let all = (function () {
  let Home = {
    thumbArr: [],
    editor: null,
    pageInit () {
      this.editor = editor({ pasteFilterStyle: true }).init()
      upload({ maxLength: 1, id: 'thumUploader', urlArr: this.thumbArr })
      /// jugePhone() ? this.openPC() : console.log('pc')// 判断是PC端还是手机端
      $('#btn-public').on('click', () => {
        weui.form.validate('#traRelease', error => {
          if (!error) {
            if (this.editor.txt.text() !== '') {
              var loading = weui.loading('提交中...')
              setTimeout(() => {
                loading.hide()
                // let editorJSON = this.getJSON(this.editor)
                let editorJSON = this.editor.txt.html()
                $('input[name=editor]').val(editorJSON)
                this._postTravel()
              }, 1000)
            } else {
              weui.alert('编辑文本不能为空')
            }
          }
        })
      })
      $('.linked').on('click', () => {
        model.travel.linkAct().then(data => {
          if (data.state === 'ok') {
            this.linkAct(data)
          }
        }).catch(errMsg => {
          weui.alert(errMsg)
        })
      })
      $('input[name=publication]').on('click', (e) => {
        $(e.currentTarget).parents('.weui-cell_switch').next().toggle()
        if ($('input[name=linkActId]').length > 0 && $('input[name=publication]').val() === '否') {
          weui.alert('已自动为您关联活动主办方，需要修改请先取消活动关联')
        }
      })
      $('.link-act').on('click', '.apply-trash', () => {
        $('.link-act').html('')
        $('.club-from').find('.weui-cell__ft').html('')
        $('input[name=linkClubId]').val('')
      })
      $('.club-from').on('click', () => {
        if ($('input[name=linkActId]').length > 0) {
          return false
        } else {
          model.travel.getMyClub().then(data => {
            this.linkClub(data)
          }).catch(errMsg => {
            weui.alert(errMsg)
          })
        }
      })
    },
    linkClub (data) {
      require.ensure([], () => {
        require('vendor/dialog')
        $.alert.aler({
          title: '关联活动',
          content: this.linkClubTemp(data.user_club_info),
          height: 'auto',
          blankclose: true,
          okCallback: (e) => {
            $('input[name=linkClubId]').val($(e.currentTarget).find('input[name=cId]').val())
            $('.club-from').find('.weui-cell__ft').html($(e.currentTarget).find('.weui-cell__bd p').text())
          }
        })
      }, 'aler')
    },
    linkClubTemp (data) {
      let html = ''
      data.map((key, index) => {
        html += `<label class="weui-cell weui-check__label dialog-confirm" for="c${index}">
            <div class="weui-cell__hd per-head"><img src="${key.club_logo}" alt=""></div>
            <input type="hidden" name="cId" value="${key.club_id}">
            <div class="weui-cell__bd">
                <p>${key.club_name}</p>
            </div>
            <div class="weui-cell__ft">
                <input type="radio" class="weui-check" name="radio${index}" id="c${index}">
                <span class="weui-icon-checked"></span>
            </div>
        </label>`
      })
      return clear(`<div class="weui-cells weui-cells_radio margin">${html}</div>`)
    },
    linkActTemp (data) {
      let html = ''
      data.map(key => {
        html += `<div class="apply-item dialog-confirm">
        <input type="hidden" name="linkActId" value="${key.act_id}">
        <input type="hidden" name="linkActName" value="${key.act_name}">
        <input type="hidden" name="cId" value="${key.act_club_id}">
        <input type="hidden" name="linkClubName" value="${key.act_club_name}">
        <div class="weui-cell apply-item-top">
            <div class="weui-cell__hd per-head"><img src="${key.act_img}" alt=""></div>
            <div class="weui-cell__bd">
                <p class="f-m per-name">${key.act_name}</p>
                <p class="f-s per-bbname">${key.act_ksdate}</p>
            </div>
            <div class="weui-cell__ft apply-trash" style="display:none">
              <i class="iconfont icon-trash_fill" ></i>
            </div>   
        </div>
    </div>`
      })
      return clear(html)
    },
    linkAct (data) {
      // let _thi = this
      require.ensure([], () => {
        require('vendor/dialog')
        $.alert.aler({
          title: '关联活动',
          content: this.linkActTemp(data.act),
          height: 'auto',
          blankclose: true,
          okCallback: (e) => {
            $('input[name=linkClubId]').val($(e.currentTarget).find('input[name=cId]').val())
            $('.link-act').html($(e.currentTarget).html())
            $('.link-act').find('.apply-trash').show()
            $('.club-from').find('.weui-cell__ft').html($('input[name=linkClubName]').val())

            if ($('input[name=publication]').val() === '是') {
              weui.alert('已自动为您关联活动主办方，需要修改请先取消活动关联')
            }
          }
        })
      }, 'aler')
    },
    getJSON (editor) {
      let json = editor.txt.getJSON() // 获取 JSON 格式的内容
      let jsonStr = JSON.stringify(json)
      return jsonStr
    },
    openPC () { // 显示让用户在pc端打开编辑
      $('.content-inner div').html(`<div class="pc-text">
      <div class="pc-img"></div>
      <p>电脑端编辑游记效果更佳哦~</p>
  </div>`)
    },
    _postTravel () {
      model.travel.postTravel($('#traRelease')).then((res) => {
        if (res.state === 'ok') {
          weui.toast('提交成功', 1000)
          window.history.back(-1)
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
