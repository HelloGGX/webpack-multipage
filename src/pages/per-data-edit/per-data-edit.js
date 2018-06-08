import './per-data-edit.less'
import 'components/banner/banner.less'
import $ from 'jquery'
import weui from 'weui.js'
import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import {ages, clear} from 'common/js/dom'
import {clubItem} from '../addMainItem/addMainItem'// 添加主打项目 宣言 简介
import {pickerAddr} from 'components/picker/picker'// 引入地区和日期选择对象方法

import model from 'api/getIndex'

let all = (function () {
  let Home = {
    thumbArr: [],
    textAreaTemp: `<div class="weui-cells weui-cells_form margin">
    <div class="weui-cell">
        <div class="weui-cell__bd">
            <textarea name="declaration" class="weui-textarea" style="height: 1.4rem;" maxlength="200" placeholder="请输入文本" rows="3"></textarea>
            <div class="weui-textarea-counter"><span>0</span>/200</div>
            <div class="dialog-confirm" style="margin-top:0.1rem"><a href="javascript:;" class="weui-btn weui-btn_primary">保存</a></div>
        </div>
    </div>
  </div>`,
    _imgTemp (data) {
      let id = 0
      return `${clear(`${data.map(item => `
    <li class="weui-uploader__file" data-id="${id++}" style="background-image: url(&quot;http://125.65.111.19${item}&quot;);">  </li>
    `)}`)}`
    },
    _postPerData () {
      model.person.postPerData($('#perEdit')).then(res => {
        console.log(res)
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    _getPerData () {
      let _thi = this
      model.person.getPerData().then(data => {
        console.log(data)
        _thi.thumbArr.push(data.user_img)
        $('input[name=hdImg]').val(_thi.thumbArr)
        $('#uploader .uploaderFiles').html(_thi._imgTemp(_thi.thumbArr))
        $('input[name=myName]').val(data.user_nice)
        $('input[name=signature]').val(data.user_sign)
        $('select[name=sex]').val(data.user_sex)
        $('input[name=age]').val(data.user_age)
        $('input[name=job]').val(data.user_office)
        $('input[name=myAddr]').val(data.user_hometown)
        $('input[name=sports]').val(data.user_love)
        $('input[name=travelAddr]').val(data.user_mark)
      }).catch(errMsg => {
        console.log(errMsg)
      })
    },
    pageInit () {
      this._getPerData()
      $('.myAddr').on('click', (e) => {
        pickerAddr.showAddr(e.currentTarget)
      })
      $('#saveEdit').on('click', () => {
        let _thi = this
        weui.form.validate('#perEdit', function (error) {
          if (!error) {
            var loading = weui.loading('提交中...')
            setTimeout(function () {
              loading.hide()
              _thi._postPerData()
              weui.toast('提交成功', 1000)
            }, 1000)
          }
        })
      })
      $('#uploader .weui-cell_select').on('click', () => {
        const _thi = this
        upload({maxLength: 1, size: 1, id: 'uploader', urlArr: _thi.thumbArr}).init()
      })
      clubItem.init()
      $('#job').on('click', (e) => {
        clubItem.initTemp(e, ['学生', 'IT/互联网/通讯', '金融', '法律', '咨询', '文化/艺术', '影视/娱乐', '教育/科研', '房地产/建筑', '医药/健康', '能源/环保'])
      })
      $('#sports').on('click', (e) => {
        clubItem.initTemp(e, ['跑步', '骑行', '徒步', '游泳', '篮球', '足球', '羽毛球', '乒乓球', '网球', '高尔夫', '桌球', '舞蹈', '健身房'])
      })
      $('#travelAddr').on('click', (e) => {
        clubItem.initTemp(e, ['香格里拉', '桂林', '三亚', '呼伦贝尔', '丽江', '大理', '西藏', '鼓浪屿', '张家界', '九寨沟', '台湾', '韩国', '日本'])
      })
      $('#signature').on('click', (e) => {
        require.ensure([], () => {
          require('vendor/dialog')
          $.alert.aler({
            title: '提示',
            content: this.textAreaTemp,
            height: 320,
            blankclose: true,
            okCallback: function () {
              $(e.currentTarget).val($('textarea[name=declaration]').val())
            }
          })
        }, 'aler')
      })

      $('#age').on('click', (e) => {
        weui.datePicker({
          start: 1760,
          end: 2030,
          defaultValue: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()],
          onChange: (result) => {

          },
          onConfirm: (result) => {
            let birth = result.toString().replace(/\W/g, '-')
            console.log(result)
            $('input[name=birth]').val(`${result[0].label}${result[1].label}${result[2].label}`)
            $(e.currentTarget).val(ages(birth.toString()))
          },
          id: 'datePicker',
          className: 'picker'
        })
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
