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
import {converToDate, getQueryString} from 'common/js/dom'
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
    _getActData () {
      model.getActDetailData({id: getQueryString('id')}).then(data => {
        console.log(data)
      }).catch(errMsg => {
        console.log(errMsg)
      })
    },
    pageInit () {
      if (getQueryString('id')) { // 如果是编辑模式
        $('input[name=edit]').val(getQueryString('id'))
        this._getActData()
      } else { // 如果是创建活动模式
        $('#actSubmit').on('click', (e) => {
          let _thi = this
          weui.form.validate('#createAct', function (error) {
            if (!error) {
              this.judgTime()
              var loading = weui.loading('提交中...')
              setTimeout(function () {
                loading.hide()
                _thi._postActData()
                weui.toast('提交成功', 1000)
              }, 1000)
            }
          }, regexp)
        })
      }
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
        upload.init({maxLength: 2, id: 'uploader'})
      })

      $('.actDetailCover').on('click', () => {
        upload.init({maxLength: 2, size: 3, id: 'Detailuploader'})
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
    },
    judgTime () {
      let starTime = converToDate($('#starTime').val())// 活动开始时间
      let endTime = converToDate($('#endTime').val())// 活动结束时间
      let endApplyTime = converToDate($('#endApplyTime').val())// 活动报名截止时间
      if (starTime >= endTime) {
        weui.alert('活动结束时间不能早于或等于活动开始时间')
      }
      if (endApplyTime > starTime) {
        weui.alert('报名截止时间不能晚于活动开始时间')
      }
    },
    _postActData: function () {
      model.createActData($('#createAct')).then((res) => {
        // 获取数据成功时的处理逻辑
        if (res.state === 'ok') {
          weui.alert('提交成功')
        } else {
          weui.alert('提交失败，请检查填写项')
        }
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
