import 'components/banner/banner.less'
import './create-act.less'

import {pickerAddr, pickerData} from 'components/picker/picker'// 引入地区和日期选择对象方法
import {upload} from 'components/upload/upload'// 引入上传图片对象方法
import $ from 'jquery'
import {AddapplyOption, EditapplyOption} from '../addApplyOption/addApplyOption'// 引入增加和编辑报名选项的对象
import {costWay} from '../setApplyCost/setApplyCost'// 引入费用设置的对象

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
        // require.ensure([], () => {
        //   require('vendor/dialog')
        //   $.alert.aler({
        //     title: '提示',
        //     content: '<p class="f16">hello</p>',
        //     height: 120,
        //     blankclose: true
        //   })
        // }, 'aler')
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
        upload.init({maxLength: 1})
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
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
