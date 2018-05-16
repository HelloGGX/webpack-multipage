import 'components/banner/banner.less'
import './act-create.less'

import {pickerAddr, pickerData} from 'components/picker/picker'// 引入地区和日期选择对象方法
import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import $ from 'jquery'
import weui from 'weui.js'
import {AddapplyOption, EditapplyOption} from '../addApplyOption/addApplyOption'// 引入增加和编辑报名选项的对象
import {costWay} from '../setApplyCost/setApplyCost'// 引入费用设置的对象
import model from 'api/getIndex'
import vali from 'vendor/validate'

let regexp = {
  regexp: {
    PHONE: vali.mobile()
  }
}
let all = (function () {
  let banner = {
    init () {
      this.setRight()
    },
    setRight () {
      $('.banner-right a').html('草稿箱')
      $('.banner-right a').attr('href', 'draft-box.html')
    }

  }

  let actCost = {
    init () {
      $('#actCost').on('click', () => {
        costWay.show()
      })
    }
  }
  let Home = {
    pageInit: function () {
      banner.init()// 草稿箱初始化
      AddapplyOption.Addinit()// 增加报名项初始化
      EditapplyOption.Editinit()// 编辑报名项初始化
      costWay.init()// 费用设置初始化
      actCost.init()// 活动费用设置初始化
      $('.actTime').on('click', (e) => {
        pickerData.showDate(e.currentTarget)
      })

      $('.actAddr').on('click', (e) => {
        pickerAddr.showAddr(e.currentTarget)
      })

      $('.actCover').on('click', () => {
        upload.init({maxLength: 1, fileVal: 'imgfile'})
      })
      $('.bm-way-item').on('click', (e) => {
        $(e.currentTarget).addClass('active').siblings('.bm-way-item').removeClass('active')
        if ($('#gr').hasClass('active')) {
          $(e.currentTarget).parents('li').nextAll('li').hide()
          $('#hdbmfs').val('个人')
        } else if ($('#zd').hasClass('active')) {
          $(e.currentTarget).parents('li').nextAll('li').show()
          $('#hdbmfs').val('组队')
        }
      })

      $('.bm-way-item').on('click', (e) => {
        $(e.currentTarget).addClass('active').siblings('.bm-way-item').removeClass('active')
        if ($('#gr').hasClass('active')) {
          $('#bmWay').hide()
          $('#hdbmfs').val('个人')
        } else if ($('#zd').hasClass('active')) {
          $('#bmWay').show()
          $('#hdbmfs').val('组队')
        }
      })
      $('#actSubmit').click((e) => {
        let _thi = this
        weui.form.validate('#createAct', function (error) {
          console.log(error)
          if (!error) {
            var loading = weui.loading('提交中...')
            setTimeout(function () {
              loading.hide()
              _thi._postActData()
              weui.toast('提交成功', 1000)
            }, 1500)
          }
        }, regexp)
      })
    },

    _postActData: function () {
      model.createActData($('#createAct')).then(() => {
        // 获取数据失败时的处理逻辑

        weui.alert('提交成功')
      }).catch((ErrMsg) => {
        // 获取数据失败时的处理逻辑
        weui.alert('数据获取有误')
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
