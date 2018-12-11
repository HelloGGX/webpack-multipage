import 'components/banner/banner.less'
import './act-create.less'

import { pickerAddr, pickerData } from 'components/picker/picker'// 引入地区和日期选择对象方法
import { upload } from 'components/upload/upload'// 引入上传图片对象方法
import $ from 'jquery'
import weui from 'weui.js'
import { AddapplyOption, EditapplyOption } from '../addApplyOption/addApplyOption'// 引入增加和编辑报名选项的对象
import { costWay } from '../setApplyCost/setApplyCost'// 引入费用设置的对象
import model from 'api/getIndex'
import vali from 'vendor/validate'
import { converToDate, getQueryString, clear } from 'common/js/dom'
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
    urlArr: [],
    thumbArr: [],
    _imgTemp (data) {
      let id = 0
      return `${clear(`${data.map(item => `
      <li class="weui-uploader__file" data-id="${id++}" style="background-image: url(&quot;${item}&quot;);">  </li>
      `)}`)}`
    },
    _applyCostTemp (data) {
      return `${clear(`${data.map((key) => `
      <li class="row">
      <div class="col-70">
      <div class="act_cost_title f-l">${key.prod_name}</div>
      <input type="hidden" name="applyCostName" value="${key.prod_name}">
      <div class="act_cost_people f-s ">
      <span>名额</span>${key.prod_num}人
      <input type="hidden" name="applyCostNum" value="${key.prod_num}">
      </div>
      </div>
      <div class="col-30">
      <div class="act_cost_num f-l-x">￥<span>${key.prod}</span></div>
      <input type="hidden" name="applyCostPrice" value="${key.prod}">
      </div></li>
    `)}`)}`
    },
    _addfeeTemp (data) {
      return `${clear(`${data.map(key => `
      <div name="feeitems" class="feeitems">
      <div class="list-block margin">
        <ul>
          <li>
            <div class="item-content">
              <div class="item-media removeIcon">
                <span>
                  <img src="${require(`../../imgs/icons/removeIcon.png`)}" alt="">
                </span>
              </div>
              <div class="item-inner">
                <div class="item-title small-txt high-grey">
                  费用设置
                </div>
                <div class="item-after  entered-input" style="width:70%;">
                  <input id="feename" maxlength="20" type="text" name="fyName" class="fyName" value="${key.prod_name}"
                  placeholder="20字以内">
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="item-content">
              <div class="item-media">
              </div>
              <div class="item-inner">
                <div class="item-title small-txt high-grey">
                  金额
                </div>
                <div class="item-after  entered-input" style="width:70%;">
                  <input class="feeprice" pattern="[0-9]*" type="number" name="fyje" value="${key.prod}" placeholder="有人报名后不能修改">
                </div>
              </div>
            </div>
          </li>
          <li>
            <div class="item-content">
              <div class="item-media">
              </div>
              <div class="item-inner">
                <div class="item-title small-txt high-grey">
                  名额
                </div>
                <div class="item-after  entered-input" style="width:70%;">
                  <input class="feenum" pattern="[0-9]*" type="number" value="${key.prod_num}" name="fyme" placeholder="默认不限">
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
  </div>
      `)}`)}`
    },
    _applyOptTemp (data) {
      let index = $('.apply-options .col-33').length - 1
      let _html = ''
      for (let key in data) {
        _html += `<li class="edit-item col-33" id=${'bm_' + index}>
            <a class="bm-item apply-active" data-child=${data[key]}>${key}</a>
        </li>`
      }
      return _html
    },
    _getActData () {
      let _thi = this

      model.getActDetailData({ id: getQueryString('id') }).then(data => {
        let actData = data.list[0]
        if (actData.apply_opts !== '') { // 如果有自定义的费用选项
          window.sessionStorage.setItem('applyItems', actData.apply_opts)// 存储报名选项
          AddapplyOption.applyItem = JSON.parse(window.sessionStorage.getItem('applyItems'))
          let applyOpts = JSON.parse(actData.apply_opts)
          $('#addItem').before(_thi._applyOptTemp(applyOpts))
        }

        $('input[name=actTitle]').val(actData.act_name)
        $('textarea[name=actDetail]').val(actData.act_detail_text)
        $('input[name=hdDetailImg]').val(actData.act_detail_imgs)
        _thi.urlArr = Array.from(actData.act_detail_imgs)
        $('#Detailuploader .uploaderFiles').html(_thi._imgTemp(actData.act_detail_imgs))
        $('input[name=starTime]').val(actData.act_kstime)
        $('input[name=endTime]').val(actData.act_jstime)
        $('input[name=actAddr]').val(actData.act_addr)
        $('input[name=actDetailAddr]').val(actData.act_addrs)
        _thi.thumbArr.push(actData.hd_thumb_url)
        $('input[name=hdimg]').val(_thi.thumbArr)
        $('#thumUploader .uploaderFiles').html(_thi._imgTemp(_thi.thumbArr))
        $('input[name=applyCostType]').val(actData.pay_state)
        $('#actCost').find('.weui-select').html(actData.pay_state)

        if (actData.pay_state === '收费') {
          costWay._fee = true
          $('#fymx').html(_thi._applyCostTemp(actData.pricecl))
          $('#r2').attr('checked', 'checked')
          $('#feeDetail').show()
          $('#unfeeDetail').hide()
          $('input[name=fysfzme]').val(actData.apply_cost_nums)
          $('input[name=refundSet]').val(actData.refund)
          $('#feeItem').html(_thi._addfeeTemp(actData.pricecl))
          $('textarea[name=ExpDescr]').val(actData.ExpDescr)
          $('input[name=payOnline]').prop('checked', () => {
            if (actData.online_pay === '是') {
              $('input[name=payOnline]').val('是')
              return true
            } else {
              $('input[name=payOnline]').val('否')
              return false
            }
          })

          $('input[name=otherPay]').prop('checked', () => {
            if (actData.other_pay === '是') {
              $('input[name=otherPay]').val('是')
              return true
            } else {
              $('input[name=otherPay]').val('否')
              return false
            }
          })
        } else {
          costWay._fee = false
        }
        $('input[name=refund]').val(actData.refund)
        $('input[name=applyCostNums]').val(actData.apply_cost_nums)
        $('input[name=ExpDescr]').val(actData.ExpDescr)
        $('input[name=payOnlineInput]').val(actData.online_pay)
        $('input[name=otherPayInput]').val(actData.other_pay)

        $('select[name=actStar]').val(actData.act_integral)
        $('select[name=actLevel]').val(actData.level)
        $('select[name=actType]').val(actData.act_type[0])
        $('select[name=insurance]').val(actData.act_insur)
        let arr = []
        if (actData.apply_sex !== '') {
          arr.push(actData.apply_sex)

          $($('.bm-item')[2]).addClass('apply-active')
        }
        if (actData.apply_realname !== '') {
          arr.push(actData.apply_realname)
          $($('.bm-item')[3]).addClass('apply-active')
        }

        if (actData.apply_idcard !== '') {
          arr.push(actData.apply_idcard)
          $($('.bm-item')[4]).addClass('apply-active')
        }

        $('input[name=actOptions]').val(arr)
        $('input[name=actOptions1]').val(actData.apply_opts)

        $('input[name=endApplyTime]').val(actData.apply_endtime)
        $('input[name=hdbmfs]').val(actData.apply_way)
        $('input[name=zdend]').val(actData.group_min)
        $('input[name=zdtop]').val(actData.group_max)
        if (actData.apply_way === '组队') {
          $('#zd').addClass('active').siblings().removeClass('active')
          $('#bmWay').show()
        } else {
          $('#gr').addClass('active').siblings().removeClass('active')
          $('#bmWay').hide()
        }
        $('input[name=groupNum]').val(actData.group_num)
        $('input[name=bmsh]').val(actData.apply_review)
        $('input[name=bmsh]').prop('checked', () => {
          if (actData.apply_review === '是') {
            return true
          } else {
            return false
          }
        })
        $('input[name=bmbr]').val(actData.apply_help)
        $('input[name=bmbr]').prop('checked', () => {
          if (actData.apply_help === '是') {
            return true
          } else {
            return false
          }
        })
        $('select[name=actStyle]').val(actData.act_class)
        $('select[name=sms]').val(actData.apply_sms)
        $('textarea[name=applyNotice]').val(actData.act_should_know)
        $('#actSubmit').text('确定')
        $('#actSave').hide()

        upload({ maxLength: 15, size: 3, id: 'Detailuploader', urlArr: _thi.urlArr })
        upload({ maxLength: 1, id: 'thumUploader', urlArr: _thi.thumbArr })
      }).catch(errMsg => {
        console.log(errMsg)
      })
    },
    pageInit () {
      if (getQueryString('id') !== null) { // 如果是编辑模式
        $('input[name=edit]').val(getQueryString('id'))
        this._getActData()

        $('#actSubmit').on('click', (e) => {
          let _thi = this
          weui.form.validate('#createAct', function (error) {
            if (!error) {
              if (_thi.judgTime()) {
                var loading = weui.loading('提交中...')
                setTimeout(function () {
                  loading.hide()
                  _thi._updateActData()
                  weui.toast('提交成功', 1000)
                }, 1000)
              }
            }
          }, regexp)
        })
      } else { // 如果是创建活动模式
        upload({ maxLength: 15, size: 3, id: 'Detailuploader', urlArr: this.urlArr })
        upload({ maxLength: 1, id: 'thumUploader', urlArr: this.thumbArr })

        $('#actSubmit').on('click', (e) => {
          let _thi = this

          weui.form.validate('#createAct', function (error) {
            if (!error) {
              if (_thi.judgTime()) {
                var loading = weui.loading('提交中...')
                setTimeout(function () {
                  loading.hide()
                  _thi._postActData()
                  weui.toast('提交成功', 1000)
                }, 1000)
              }
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
      let flag = true
      let starTime = converToDate($('#starTime').val())// 活动开始时间
      let endTime = converToDate($('#endTime').val())// 活动结束时间
      let endApplyTime = converToDate($('#endApplyTime').val())// 活动报名截止时间
      if (starTime >= endTime) {
        weui.alert('活动结束时间不能早于或等于活动开始时间')
        flag = false
      }
      if (endApplyTime > starTime) {
        weui.alert('报名截止时间不能晚于活动开始时间')
        flag = false
      }
      return flag
    },
    _updateActData () {
      model.magAct.updateAct($('#createAct')).then((res) => {
        // 获取数据成功时的处理逻辑
        if (res.state === 'ok') {
          weui.alert('更改成功')
        } else {
          weui.alert('提交失败，请检查填写项')
        }
      }).catch((ErrMsg) => {
        // 获取数据失败时的处理逻辑
        weui.alert(ErrMsg)
      })
    },
    _postActData: function () {
      model.createActData($('#createAct')).then((res) => {
        // 获取数据成功时的处理逻辑

        if (res.state === 'ok') {
          weui.alert('提交成功,等待审核')
          window.location.href = 'act-mag.html'
        } else {
          weui.alert('提交失败,你可能不是俱乐部不能发起活动')
        }
      }).catch((ErrMsg) => {
        // 获取数据失败时的处理逻辑
        weui.alert(ErrMsg)
      })
    }
  }
  return Home
}())

$(function () {
  all.pageInit()
})
