
import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = 'http://125.65.111.19:82/api/'

const request = axios.create()

request.interceptors.request.use(config => {
  config.data = qs.stringify(config.data)
  config.header = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

const createError = (code, resp) => {
  const err = new Error(resp.message)
  err.code = code
  return err
}
const handleRequest = (request) => {
  return new Promise((resolve, reject) => {
    request.then((res) => {
      const data = res.data
      if (!data) {
        return reject(createError(400, 'no data'))
      }
      // if (!data.success) {
      //   return reject(createError(400, data.message))
      // }
      resolve(data)
    }).catch((err) => {
      const resp = err.response
      console.log('---------------', resp)
      if (resp.status === 401) {
        reject(createError(401, 'need auth'))
      }
    })
  })
}

export default {
  request,
  handleRequest
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
