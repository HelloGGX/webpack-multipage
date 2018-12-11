import DISTRICTS from '../../api/areaData'
import weui from 'weui.js'
import $ from 'jquery'
const DEFAULT_CODE = 100000

let pickerAddr = {// 地区选择
  province: 510000,
  city: 510100,
  area: 510114,
  onlyProvince: false,
  hideArea: false,
  cache: true,
  depth: 3,
  defaultValue: undefined,

  determineType (value) {
    if (typeof value === 'string') {
      return this.getAreaCode(value)
    }
    return value
  },
  formatDistricts (code = DEFAULT_CODE, time = 1) {
    let districts = []
    let list = this.getDistricts(code)
    for (let item in list) {
      if (this.getDistricts(item) != null && !this.onlyProvince && !(time === 2 && this.checkHideArea(code))) {
        districts.push({ label: list[item], value: item, children: this.formatDistricts(item, time + 1) })
      } else {
        districts.push({ label: list[item], value: item })
      }
    }
    return districts
  },
  getDistricts (code = DEFAULT_CODE) {
    return DISTRICTS[code] || null
  },
  getAreaCode (name) {
    console.log(name)
    for (var x in DISTRICTS) {
      for (var y in DISTRICTS[x]) {
        if (name === DISTRICTS[x][y]) {
          return y
        }
      }
    }
  },
  calculateDepth () {
    if (this.onlyProvince) {
      this.depth = 1
      this.defaultValue = [this.determineType(this.province)]
    } else if (this.hideArea) {
      this.depth = 2
      this.defaultValue = [this.determineType(this.province), this.determineType(this.city)]
    } else {
      this.defaultValue = [this.determineType(this.province), this.determineType(this.city), this.determineType(this.area)]
    }
  },
  checkHideArea (code) {
    return this.hideArea && code.toString().substr(-2, 2) === '00'
  },
  showAddr (_this) {
    let me = this
    this.calculateDepth()
    weui.picker(this.formatDistricts(), {
      depth: me.depth,
      defaultValue: [510000, 510100, 510114],
      onChange: function onChange (result) {
        console.log(result)
      },
      onConfirm: function onConfirm (result) {
        $(_this).find('.weui-select input').val(`${result[0].label} ${result[1].label} ${result[2].label}`)
      },
      className: 'picker'
    })
  }
}

let pickerData = {// 日期选择
  hours: [],
  minites: [],
  symbol: [{ label: ':', value: 0 }],
  showDate (_this) {
    weui.datePicker({
      start: new Date(),
      end: 2030,
      defaultValue: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()],
      onChange: (result) => {
        console.log(result)
      },
      onConfirm: (result) => {
        // 二级调用：时间
        $('.picker .weui-picker').on('animationend webkitAnimationEnd', () => {
          this.show_expect_time_picker(_this, result)
        })
      },
      id: 'datePicker',
      className: 'picker'
    })
  },
  show_expect_time_picker (_this, date) {
    date = date[0].label + date[1].label + date[2].label
    if (!this.hours.length) {
      for (var i = 0; i < 24; i++) {
        let hoursItem = {}
        hoursItem.label = ('' + i).length === 1 ? '0' + i : '' + i
        hoursItem.value = i
        this.hours.push(hoursItem)
      }
    }
    if (!this.minites.length) {
      for (var j = 0; j < 60; j++) {
        let minitesItem = {}
        minitesItem.label = ('' + j).length === 1 ? '0' + j : '' + j
        minitesItem.value = j
        this.minites.push(minitesItem)
      }
    }
    weui.picker(this.hours, this.symbol, this.minites, {
      className: 'picker',
      defaultValue: [new Date().getHours() + 1, 0, 0],
      onConfirm: function (result) {
        let time = result[0].label + ':' + result[2].label
        let expectDate = date + ' ' + time
        $(_this).find('.weui-select input').val(expectDate)
      }
    })
  }
}

export { pickerAddr, pickerData }
