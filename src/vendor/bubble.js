import $ from 'jquery'
import BScroll from 'better-scroll'

let bubble = {
  width: 50,
  height: 70,
  wh: null,
  opt () {
    this.y = 0
    this.ratio = window.devicePixelRatio
    this.width *= this.ratio
    this.height *= this.ratio
    this.initRadius = 18 * this.ratio
    this.minHeadRadius = 12 * this.ratio
    this.minTailRadius = 5 * this.ratio
    this.initArrowRadius = 10 * this.ratio
    this.minArrowRadius = 6 * this.ratio
    this.arrowWidth = 3 * this.ratio
    this.maxDistance = 40 * this.ratio
    this.initCenterX = 25 * this.ratio
    this.initCenterY = 25 * this.ratio
    this.headCenter = {
      x: this.initCenterX,
      y: this.initCenterY
    }
    return {
      w: this.width,
      h: this.height
    }
  },
  _draw (distance) {
    if (!this.initRadius) { // 如果没有值
      this.wh = this.opt()
      this.initDom(this.wh.w, this.wh.h)
    } else {
      this.initDom(this.wh.w, this.wh.h)
    }

    let bubble = document.getElementById('bubble')

    if (bubble) {
      let ctx = bubble.getContext('2d')
      ctx.clearRect(0, 0, bubble.width, bubble.height)

      this._drawBubble(ctx, distance)

      this._drawArrow(ctx, distance)
    }
    // console.log(bubble);
  },
  _drawBubble (ctx, distance) {
    ctx.save()
    ctx.beginPath()

    let rate = distance / this.maxDistance
    let headRadius = this.initRadius - (this.initRadius - this.minHeadRadius) * rate

    this.headCenter.y = this.initCenterY - (this.initRadius - this.minHeadRadius) * rate

    // 画上半弧线
    ctx.arc(this.headCenter.x, this.headCenter.y, headRadius, 0, Math.PI, true)

    // 画左侧贝塞尔
    let tailRadius = this.initRadius - (this.initRadius - this.minTailRadius) * rate
    let tailCenter = {
      x: this.headCenter.x,
      y: this.headCenter.y + distance
    }

    let tailPointL = {
      x: tailCenter.x - tailRadius,
      y: tailCenter.y
    }
    let controlPointL = {
      x: tailPointL.x,
      y: tailPointL.y - distance / 2
    }

    ctx.quadraticCurveTo(controlPointL.x, controlPointL.y, tailPointL.x, tailPointL.y)

    // 画下半弧线
    ctx.arc(tailCenter.x, tailCenter.y, tailRadius, Math.PI, 0, true)

    // 画右侧贝塞尔
    let headPointR = {
      x: this.headCenter.x + headRadius,
      y: this.headCenter.y
    }
    let controlPointR = {
      x: tailCenter.x + tailRadius,
      y: headPointR.y + distance / 2
    }
    ctx.quadraticCurveTo(controlPointR.x, controlPointR.y, headPointR.x, headPointR.y)

    ctx.fillStyle = 'rgb(224,46,36)'
    ctx.fill()
    ctx.strokeStyle = 'rgb(245,245,245)'
    ctx.stroke()
    ctx.restore()
  },
  _drawArrow (ctx, distance) {
    ctx.save()
    ctx.beginPath()

    let rate = distance / this.maxDistance
    let arrowRadius = this.initArrowRadius - (this.initArrowRadius - this.minArrowRadius) * rate

    // 画内圆
    ctx.arc(this.headCenter.x, this.headCenter.y, arrowRadius - (this.arrowWidth - rate), -Math.PI / 2, 0, true)

    // 画外圆
    ctx.arc(this.headCenter.x, this.headCenter.y, arrowRadius, 0, Math.PI * 3 / 2, false)

    ctx.lineTo(this.headCenter.x, this.headCenter.y - arrowRadius - this.arrowWidth / 2 + rate)
    ctx.lineTo(this.headCenter.x + this.arrowWidth * 2 - rate * 2, this.headCenter.y - arrowRadius + this.arrowWidth / 2)

    ctx.lineTo(this.headCenter.x, this.headCenter.y - arrowRadius + this.arrowWidth * 3 / 2 - rate)

    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fill()
    ctx.strokeStyle = 'rgb(255,255,255)'
    ctx.stroke()
    ctx.restore()
  },
  watch (pro, callback) {
    if (pro in this) {
      let old = this[pro]
      Object.defineProperty(this, pro, {
        set: function (val) {
          let o = old
          old = val
          callback(val, o, this)
        },
        get: function () {
          return old
        }
      })
    } else {
      throw new Error('no such property')
    }
  }
}
let scrol = {
  pullDownRefresh: true,
  pullDownInitTop: -10,
  beforePullDown: true,
  isRebounding: false,
  isPullingDown: false,
  isPullUpLoad: false,
  pullUpLoad: true,
  pullUpDirty: true,
  pullDownStyle: '',
  bubbleY: 0
}
// 让 scrol 委托 bubble
// 现在把 scrol 关联到 bubble
// scrol = Object.create(bubble);
// 节流器
Object.setPrototypeOf(scrol, bubble)

scrol.initUpDom = function () {
  let _html = `<div id="pullup" class="pullup-wrapper">
    <div class="before-trigger" style="display:none">
      <span>已经没有数据了</span>
    </div>
    <div class="after-trigger">
      <div class="loading-container">
        <img src="${require('../imgs/icons/loading.gif')}">
      </div>
    </div>
  </div>`
  if ($('#pullup').length > 0) {

  } else {
    $('.bubble-wrapper .content-inner').append(_html)
  }
}
scrol.initDom = function (w, h) {
  let _html = `<div id="pulldown" class="pulldown-wrapper">
              <div class="before-trigger">
                   <canvas id="bubble" width='${w}' height='${h}' ></canvas>
              </div>
              <div class="after-trigger" style="display:none">
                <div id="isPullingDown" class="loading">
                      <div class="loading-container">
                          <img src="${require('../imgs/icons/loading.gif')}">
                      </div>
                </div>
                <div id="refreshDone"><span>刷新成功</span></div>
              </div>
          </div>`
  if ($('#pulldown').length > 0) {

  } else {
    $('.bubble-wrapper').before(_html)
  }
}
scrol.initScroll = function (downfn, upfn) {
  let options = {
    probeType: 2,
    click: true,
    scrollY: true,
    scrollX: false,
    startX: 0,
    startY: 0,
    scrollbar: {
      fade: true,
      interactive: true // 1.8.0 新增
    },
    pullDownRefresh: {
      threshold: 70,
      stop: 40
    },
    pullUpLoad: {
      threshold: 100
    }
  }
  this.scroll = new BScroll('.bubble-wrapper', options)

  if (this.pullDownRefresh) {
    this._draw()
    $('#bubble').show()
    this.scroll.openPullDown()
    this._initPullDownRefresh(downfn)
  } else {
    $('#bubble').hide()
    this.scroll.closePullDown()
  }
  if (this.pullUpLoad) {
    this._initPullUpLoad(upfn)
  }
}
scrol._initPullDownRefresh = function (fn) {
  let me = this

  if (!this.pullDownRefresh) {
    return
  }

  $('#bubble').css('width', (me.width / me.ratio) + 'px')
  $('#bubble').css('height', (me.height / me.ratio) + 'px')

  this.scroll.on('pullingDown', function () {
    me.beforePullDown = false
    me.isPullingDown = true
    $('.before-trigger').hide()
    $('.after-trigger').show()
    $('#isPullingDown').show()
    $('#refreshDone').hide()

    me.onPullingDown(fn)
  })

  this.scroll.on('scroll', function (pos) {
    if ($('#bubble').length > 0) {
      if (me.beforePullDown) {
        me.y = Math.max(0, pos.y + me.pullDownInitTop)
        me.distance = Math.max(0, Math.min(me.y * me.ratio, me.maxDistance))
        me._draw(me.distance)
        $('#pulldown').css('top', Math.min(pos.y + me.pullDownInitTop, 40) + 'px')
      } else {
        me.y = 0
        me.distance = Math.max(0, Math.min(me.y * me.ratio, me.maxDistance))
        me._draw(me.distance)
      }

      if (me.isRebounding) {
        $('#pulldown').css('top', (10 - (40 - pos.y)) + 'px')
      }
    } else { // 如果页面被切换就销毁
      me.destroy()
    }
  })
}
scrol.refresh = function () {
  this.scroll && this.scroll.refresh()
}
scrol.destroy = function () {
  this.scroll && this.scroll.destroy()
}
scrol.forceUpdate = function (dirty) {
  let me = this
  $('#pullup').show()
  if (this.pullDownRefresh && this.isPullingDown) {
    this.isPullingDown = false
    $('#isPullingDown').hide()
    $('#refreshDone').show()
    this._reboundPullDown().then(function () {
      me._afterPullDown()
    })
  } else if (this.pullUpLoad && this.isPullUpLoad) {
    this.isPullUpLoad = false
    $('#pullup .before-trigger').show()
    $('#pullup .after-trigger').hide()
    this.scroll.finishPullUp()
    this.pullUpDirty = dirty
    this.refresh()
  } else {
    this.refresh()
  }
}
scrol._reboundPullDown = function () { // 下拉弹回时的函数
  let me = this
  let { stopTime = 600 } = me.pullDownRefresh
  return new Promise(function (resolve) {
    setTimeout(function () {
      me.isRebounding = true
      me.scroll.finishPullDown()
      resolve()
    }, stopTime)
  })
}
scrol._afterPullDown = function () { // 下拉执行完成后的函数
  let me = this
  setTimeout(function () {
    $('#pulldown').css('top', me.pullDownInitTop + 'px')
    me.beforePullDown = true
    me.isRebounding = false
    $('.before-trigger').show()
    $('.after-trigger').hide()
    me.refresh()
  }, me.scroll.options.bounceTime)
}
scrol.onPullingDown = function (fn) { // 模拟更新数据
  console.log('pulling down and load data')
  fn()
}

scrol._initPullUpLoad = function (fn) { // 初始化上拉加载
  this.initUpDom()
  this.scroll.on('pullingUp', () => {
    this.isPullUpLoad = true
    $('#pullup .before-trigger').hide()
    $('#pullup .after-trigger').show()
    this.onPullingUp(fn)
  })
}
scrol.onPullingUp = function (fn) { // 上拉过程中
  // 更新数据
  setTimeout(() => {
    fn()
  }, 600)
}
let bubb = {
  init: (downfn, upfn) => {
    scrol.initScroll(downfn, upfn)
  },
  update: () => {
    scrol.forceUpdate()
  }
}

export { bubb }
