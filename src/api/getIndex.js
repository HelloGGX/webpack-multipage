import {serializeObject} from 'common/js/dom'
import db from '../db/db'

export default {
  getIndexData (data) { // 获取首页数据
    return db.handleRequest(db.request.get('getIndex.php', {
      params: data
    }))
  },
  getActData (data) { // 获取活动页面数据
    return db.handleRequest(db.request.get('getAct.php', {
      params: data
    }))
  },
  createActData (e) { // 创建活动提交数据
    let data = serializeObject(e)

    return db.handleRequest(db.request.post('getAct_up.php', {
      // params: {
      //   appid: 'SD119',
      //   key: 'SD119110'
      // },
      data: data
    }))
  },
  getClubData (data) { // 获取社区页面的俱乐部数据
    return db.handleRequest(db.request.get('getClub.php', {
      params: data
    }))
  },
  getActDetailData (data) { // 获取活动详情页的数据
    return db.handleRequest(db.request.get('getActDetail.php', {
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
