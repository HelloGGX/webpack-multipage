import {getCookie, delCookie} from 'common/js/dom'
import model from '../../api/getIndex'
import weui from 'weui.js'

let username = getCookie('username')
let token = getCookie('token')

export function judgeLogin (loginCallBack, noLoginCallBack) {
  model.postUserData({username: username, token: token}).then((res) => { // 如果匹配用户信息成功
    // 这里看res的返回
    if (res.login === 'ok') { // 如果已经登陆过
      loginCallBack()
    } else { // 如果没有登陆
      delCookie('username')
      delCookie('token')
      noLoginCallBack()
    }
  }).catch((errMsg) => {
    // 获取数据失败时的处理逻辑
    weui.alert(errMsg)
  })
}
