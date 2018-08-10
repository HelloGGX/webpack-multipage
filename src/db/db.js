
import axios from 'axios'
import qs from 'qs'
import weui from 'weui.js'
// import {showFullScreenLoading, tryHideFullScreenLoading} from 'common/js/common'

axios.defaults.baseURL = 'http://www.shanduhuwai.com/api/'

const request = axios.create()
let loading
request.interceptors.request.use(config => { // 在请求或响应被 then 或 catch 处理前拦截它们。
  // 在发送请求之前做些什么

  if (config.showLoading) {
    loading = weui.loading('正在加载')
  }
  config.data = qs.stringify(config.data)
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(response => {
  // 对响应数据做点什么
  if (response.config.showLoading) {
    setTimeout(function () {
      loading.hide()
    }, 800)
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

const createError = (code, resp) => {
  const err = new Error(resp.message)
  err.code = code
  return err
}

const handleAll = (request) => { // promisory一个promise工厂
  let args = []
  for (let i = 0; i < request.length; i++) {
    args.push(`data${i}`)
  }
  return new Promise((resolve, reject) => {
    axios.all(request).then(axios.spread((...args) => {
      resolve(args)
    })).catch((err) => {
      console.log(err)
      reject(createError(401, 'need auth'))
    })
  })
}
const handleRequest = (request) => {
  return new Promise((resolve, reject) => {
    request.then((res) => {
      const data = res.data
      if (!data) {
        return reject(createError(400, 'no data'))
      }
      // if (res.statusText === 'OK') { // 数据插入成功
      //   weui.alert('创建成功，正在加紧审核')
      // }
      // if (!data.success) {
      //   return reject(createError(400, data.message))
      // }

      resolve(data)// 异步操作成功时调用，并将异步操作的结果作为参数传递出去
    }).catch((err) => {
      const resp = err.response
      console.log('---------------', resp)
      if (resp.statusText === 401) {
        reject(createError(401, 'need auth'))// 异步操作失败时调用，并将异步操作爆出的错误作为参数传递出去
      }
    })
  })
}

export default {
  request,
  handleRequest,
  handleAll
}
// // http response 拦截器
// request.interceptors.response.use(
//   response => {
//   // 对响应数据做点什么
//     return response
//   }, function (error) {
//   // 对响应错误做点什么
//     return Promise.reject(error)
//   })
