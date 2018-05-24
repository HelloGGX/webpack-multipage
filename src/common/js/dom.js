import $ from 'jquery'

export function compile (template) { // 模板编译函数
  let evalExpr = /<%=(.+?)%>/g
  let expr = /<%([\s\S]+?)%>/g
  template = template
    .replace(evalExpr, '`); \n echo( $1 ); \n echo(`')
    .replace(expr, '`); \n $1 \n echo(`')
  template = 'echo(`' + template + '`);'
  let script =
`(function parse(data){
let output = "";
function echo(html){
output += html;
}
${template}
return output;
})`
  return script
}

export function Trim (str, global) { // 去掉字符串中的所有空格
  let result
  result = str.replace(/(^\s+)|(\s+$)/g, '')
  if (global.toLowerCase() === 'g') {
    result = result.replace(/\s/g, '')
  }
  return result
}
export function clear (str) { // 取消字符串中出现的所有逗号
  str = str.replace(/,/g, '')
  return str
}
export function getQueryString (name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}
// 将从form中通过$('#form').serialize()获取的值转成json
export function serializeObject (form) {
  let o = {}
  $.each(form.serializeArray(), function (index) {
    if (o[this['name']]) {
      o[this['name']] = o[this['name']] + ',' + this['value']
    } else {
      o[this['name']] = this['value']
    }
  })
  return o
}
export function pageName () {
  let a = window.location.href
  let b = a.split('/')
  let c = b.slice(b.length - 1, b.length).toString(String).split('.')
  return c.slice(0, 1)
}
/* 用export把方法暴露出来 */
/* 设置cookie */
export function setCookie (cName, value, expire) {
  let date = new Date()
  // 这个是cookie有效期，将cookie的有效时间设成当前时间之前就是删除
  date.setSeconds(date.getSeconds() + expire)
  document.cookie = cName + '=' + escape(value) + '; expires=' + date.toGMTString()
}

/* 获取cookie */
export function getCookie (cName) {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + '=')
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) cEnd = document.cookie.length
      return unescape(document.cookie.substring(cStart, cEnd))
    }
  }
  return ''
}

/* 删除cookie */
export function delCookie (cName) {
  setCookie(cName, '', -1)
}

/** ************把最近日期转换成前天，昨天，明天************************** */
export function transDate ($time) {
  let date = $time.trim()
  let tt = new Date(date)
  let days = parseInt((new Date().getTime() - tt.getTime()) / 86400000)
  let today = new Date().getDate()
  // let year = tt.getFullYear()
  let mouth = tt.getMonth() + 1
  let day = tt.getDate()
  let time = tt.getHours() < 10 ? '0' + tt.getHours() : tt.getHours()
  let min = tt.getMinutes() < 10 ? '0' + tt.getMinutes() : tt.getMinutes()
  let result
  let offset
  offset = Math.abs(today - day)
  if (days < 3 && offset < 3) {
    if (offset === 0) {
      result = '今天' + time + ':' + min
    } else if (offset === 1) {
      result = '昨天' + time + ':' + min
    } else if (offset === 2) {
      result = '前天' + time + ':' + min
    }
  } else {
    result = mouth + '-' + day + ' ' + time + ':' + min
  }
  return result
}
