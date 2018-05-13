import axios from 'axios'
// import sha1 from 'sha1'

const request = axios.create({
  baseURL: '/', // 'http://125.65.111.19:82/api'
  // `headers` 是即将被发送的自定义请求头
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  auth: {
    username: 'username',
    password: 'password'
  }
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
  getIndexData (data) { // 获取首页数据
    return handleRequest(request.get('src/api/getIndex.json', {
      params: data
    }))
  },
  getActData (data) { // 获取活动页面数据
    return handleRequest(request.get('src/api/getAct.json', {
      params: data
    }))
  },
  getClubData (data) { // 获取社区页面的俱乐部数据
    return handleRequest(request.get('src/api/getClub.json', {
      params: data
    }))
  },
  getActDetailData (data) { // 获取活动详情页的数据
    return handleRequest(request.get('src/api/getActDetail.json', {
      params: data
    }))
  }
}

// export function getIndexData (data) { // 获取首页数据
//   const url = '/src/api/getIndex.json'// http://125.65.111.19:82/api/getIndex.php

//   return axios.get(url, {
//     params: data
//   })
//     .then((res) => {
//       return Promise.resolve(res.data)
//     }).catch((error) => {
//       return Promise.reject(error.data)
//     })
//     // return new Promise(function(resolve,reject){
//     //     $.ajax({
//     //         type:"GET",
//     //         url:url,
//     //         success:function(data){
//     //             if(data){//这里应该是data.Status=="1",到时候后台提供api的时候改
//     //                 resolve(data)//在异步操作成功时调用
//     //             }else{
//     //                 reject(data.ErrMsg);//在异步操作失败时调用
//     //             }
//     //         }
//     //     });
//     // })
// };

// export function getActData (data) { // 获取活动页面数据
//   const url = '/src/api/getAct.json'

//   return axios.get(url, {
//     params: data
//   })
//     .then((res) => {
//       return Promise.resolve(res.data)
//     }).catch((error) => {
//       return Promise.reject(error.data)
//     })
// }

// export function getClubData (data) { // 获取社区页面的俱乐部数据
//   const url = '/src/api/getClub.json'

//   return axios.get(url, {
//     params: data
//   })
//     .then((res) => {
//       return Promise.resolve(res.data)
//     }).catch((error) => {
//       return Promise.reject(error.data)
//     })
// }

// export function getActDetailData (data) { // 获取活动详情页的数据
//   const url = '/src/api/getActDetail.json'

//   return axios.get(url, {
//     params: data // 这里要传活动的id及相关参数
//   })
//     .then((res) => {
//       return Promise.resolve(res.data)
//     }).catch((error) => {
//       return Promise.reject(error.data)
//     })
// }
