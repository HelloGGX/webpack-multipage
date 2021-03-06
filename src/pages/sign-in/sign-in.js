import './sign-in.less'
import 'components/banner/banner.less'
import model from 'api/getIndex'
import weui from 'weui.js'
import $ from 'jquery'
import { parserDate, getCountDays } from 'common/js/dom'

let all = (function () {
  let $$ = function (id) {
    return typeof id === 'string' ? document.getElementById(id) : id
  }
  let Class = {
    create: function () {
      return function () {
        this.initialize.apply(this, arguments)
      }
    }
  }
  Object.extend = function (destination, source) {
    for (let property in source) {
      destination[property] = source[property]
    }
    return destination
  }
  let Calendar = Class.create()
  Calendar.prototype = {
    initialize: function (container, options) {
      this.Container = $$(container) // 容器(table结构)
      this.Days = [] // 日期对象列表
      this.SetOptions(options)
      this.Year = this.options.Year
      this.Month = this.options.Month
      this.onToday = this.options.onToday
      this.onSignIn = this.options.onSignIn
      this.onFinish = this.options.onFinish
      this.qdDay = this.options.qdDay
      this.isSignIn = false
      this.Draw()
    },
    // 设置默认属性
    SetOptions: function (options) {
      this.options = { // 默认值
        Year: new Date().getFullYear(), // 显示年
        Month: new Date().getMonth() + 1, // 显示月
        qdDay: null,
        onToday: function () {}, // 已签到
        onSignIn: function () {}, // 今天是否签到
        onFinish: function () {} // 日历画完后触发
      }
      Object.extend(this.options, options || {})
    },
    // 上一个月
    PreMonth: function () {
      // 先取得上一个月的日期对象
      let d = new Date(this.Year, this.Month - 2, 1)
      // 再设置属性
      this.Year = d.getFullYear()
      this.Month = d.getMonth() + 1
      // 重新画日历
      this.Draw()
    },
    // 下一个月
    NextMonth: function () {
      let d = new Date(this.Year, this.Month, 1)
      this.Year = d.getFullYear()
      this.Month = d.getMonth() + 1
      this.Draw()
    },
    // 画日历
    Draw: function () {
      // 签到日期
      let day = this.qdDay
      // 日期列表
      let arr = []
      // 用当月第一天在一周中的日期值作为当月离第一天的天数
      for (let i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++) {
        arr.push('&nbsp;')
      }
      // 用当月最后一天在一个月中的日期值作为当月的天数
      for (let i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++) {
        arr.push(i)
      }
      let frag = document.createDocumentFragment()
      this.Days = []
      while (arr.length > 0) {
        // 每个星期插入一个tr
        let row = document.createElement('tr')
        // 每个星期有7天
        for (let i = 1; i <= 7; i++) {
          let cell = document.createElement('td')
          cell.innerHTML = '&nbsp;'
          if (arr.length > 0) {
            let d = arr.shift()
            cell.innerHTML = '<span>' + d + '</span>'
            if (d > 0 && day.length) {
              for (let ii = 0; ii < day.length; ii++) {
                this.Days[d] = cell
                // 已签到
                if (this.IsSame(new Date(this.Year, this.Month - 1, d), day[ii])) {
                  this.onToday(cell)
                }
                // 判断今天是否签到
                if (this.checkSignIn(new Date(), day[ii])) {
                  this.onSignIn()
                }
              }
            }
          }
          row.appendChild(cell)
        }
        frag.appendChild(row)
      }
      // 先清空内容再插入(ie的table不能用innerHTML)
      while (this.Container.hasChildNodes()) {
        this.Container.removeChild(this.Container.firstChild)
      }
      this.Container.appendChild(frag)
      this.onFinish()
      if (this.isSignIn) {
        this.isSignIn = false
        return this.SignIn()
      }
    },
    // 是否签到
    IsSame: function (d1, d2) {
      d2 = new Date(d2 * 1000)
      return (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate())
    },
    // 今天是否签到
    checkSignIn: function (d1, d2) {
      d2 = new Date(d2 * 1000)
      return (d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate())
    },
    // 签到
    SignIn: function () {
      let now = new Date()
      let Year = now.getFullYear()
      let Month = now.getMonth() + 1
      if (Year !== this.Year || Month !== this.Month) {
        this.Year = Year
        this.Month = Month
        this.isSignIn = true
        return this.Draw()
      }
      let day = now.getDate()
      // let arr = []
      let tb = document.getElementById('idCalendar')
      for (let i = 0; i < tb.rows.length; i++) {
        for (let j = 0; j < tb.rows[i].cells.length; j++) {
          if (day === Number(tb.rows[i].cells[j].innerText) && Year === Number(this.Year) && Month === Number(this.Month)) {
            if (tb.rows[i].cells[j].className === 'onToday') {
              return 2
            }
            tb.rows[i].cells[j].className = 'onToday'
            let date = Year + '-' + Month + '-' + day
            this.qdDay.push(Date.parse(parserDate(date)) / 1000)

            return 1
          }
        }
      }
    }
  }
  let Home = {
    pageInit () {
      this.getSign()
    },

    getSign () {
      let isSign = false
      let myday = [] // 已签到的数组
      let _thi = this

      model.sign.getSign().then(data => {
        for (let i = 0; i < data.signday.length; i++) {
          myday.push(Date.parse(parserDate(data.signday[i])) / 1000)
        }

        let cale = new Calendar('idCalendar', {
          qdDay: myday,
          onToday: function (o) {
            o.className = 'onToday'
          },
          onSignIn: function () {
            $$('sign-txt').innerHTML = '已签到'
          },
          onFinish: function () {
            $$('sign-count').innerHTML = myday.length // 已签到次数
            $$('idCalendarYear').innerHTML = this.Year
            $$('idCalendarMonth').innerHTML = this.Month // 表头年份
          }
        })
        $$('idCalendarPre').onclick = function () {
          cale.PreMonth()
        }
        $$('idCalendarNext').onclick = function () {
          cale.NextMonth()
        }
        // 添加今天签到
        $$('signIn').onclick = function () {
          if (isSign === false) {
            let res = cale.SignIn()
            if (res === 1) {
              $$('sign-txt').innerHTML = '已签到'
              $$('sign-count').innerHTML = parseInt($$('sign-count').innerHTML) + 1
              _thi.postSign(myday)
              isSign = true
            } else if (res === 2) {
              $$('sign-txt').innerHTML = '已签到'
              weui.alert('今天已经签到了')
            }
          } else {
            weui.alert('今天已经签到了')
          }
        }
      }).catch(errMsg => {
        weui.alert(errMsg)
      })
    },
    rand (myday) {
      let coin = null
      let count = 0
      if (typeof myday === 'object') {
        if (Array.isArray(myday)) {
          for (let i = myday.length - 1, l = 0; i > l; i--) {
            if (myday[i] - myday[i - 1] === 86400) {
              count++
            } else {
              count = 1
              break
            }
          }
          if (count < 4) { // 如果签到小于4天
            coin = Math.ceil(Math.random() * 10)
          } else if (count >= 4 && count < getCountDays() - 1) { // 如果连续签到5天
            coin = Math.ceil(Math.random() * 20)
          } else if (count === getCountDays() - 1) {
            coin = Math.ceil(Math.random() * 100)
          }
        }
      }
      return coin
    },
    postSign (myday) {
      let coin = this.rand(myday)
      model.sign.postSign({ coin: coin }).then(res => {
        if (res.state === 'ok') {
          weui.alert(`签到成功,恭喜你获得度币:${coin}`)
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
