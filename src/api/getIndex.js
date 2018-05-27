import {serializeObject} from 'common/js/dom'
import db from '../db/db'

let magAct = {// 管理活动
  getActInfoData (data) { // 获取活动信息数据
    return db.handleRequest(db.request.get('getActDetail.php', {
      params: data,
      showLoading: true
    }))
  },
  deleteAct (id) { // 删除活动
    return db.handleRequest(db.request.delete('act_delete.php', {
      data: {
        id: id
      }
    }))
  },
  ubdateAct (e) { // 编辑更新活动
    let data = serializeObject(e)
    return db.handleRequest(db.request.put(``, {
      data: data,
      showLoading: true
    }))
  },
  addPer () { // 添加报名成员

  },
  getPer () { // 获取未分组报名人员信息

  },
  moveToGroup () { // 移动人员到相应组

  },
  addGroup () { // 新增组

  }
}

export default {
  magAct,
  postLoginData (e) { // 登陆
    let data = serializeObject(e)
    return db.handleRequest(db.request.post('login_up.php', {
      data: data,
      showLoading: true
    }))
  },
  postRegistData (e) { // 注册
    let data = serializeObject(e)
    return db.handleRequest(db.request.post('regist_up.php', {
      data: data,
      showLoading: true
    }))
  },

  // getIndexData (data) { // 获取首页数据
  //   return db.handleRequest(db.request.get('getIndex.php', {
  //     params: data,
  //     showLoading: true
  //   }))
  // },
  postUserData (data) { // 获取首页数据,发送用户信息
    return db.handleRequest(db.request.post('getIndex.php', {
      data: data,
      showLoading: true
    }))
  },
  getActData (data) { // 获取活动页面数据
    return db.handleRequest(db.request.get('getAct.php', {
      params: data,
      showLoading: true
    }))
  },
  getActMagData (data) { // 获取管理活动页面的数据
    return db.handleRequest(db.request.get('getActMag.php', {
      params: data,
      showLoading: true
    }))
  },

  createActData (e) { // 创建活动提交数据
    let data = serializeObject(e)

    return db.handleRequest(db.request.post('getAct_up.php', {

      data: data,
      showLoading: true
    }))
  },
  getClubData (data) { // 获取社区页面的俱乐部数据
    return db.handleRequest(db.request.get('getClub.php', {
      params: data,
      showLoading: true
    }))
  },
  createClubData (e) { // 创建俱乐部提交数据
    let data = serializeObject(e)

    return db.handleRequest(db.request.post('getClub_up.php', {
      data: data,
      showLoading: true
    }))
  },
  getClubDetailData (data) { // 获取俱乐部的详细数据（包括活动）
    return db.handleRequest(db.request.get('getClubDetail.php', {
      params: data,
      showLoading: true
    }))
  },
  joinClubData (data) { // 加入俱乐部提交数据
    return db.handleRequest(db.request.post('joinClub.php', {
      data: data,
      showLoading: true
    }))
  },
  getActDetailData (data) { // 获取活动详情页的数据
    return db.handleRequest(db.request.get('getActDetail.php', {
      params: data,
      showLoading: true
    }))
  },
  getApplyData (data) { // 获取报名选项数据
    return db.handleRequest(db.request.get('getApply.php', {
      params: data,
      showLoading: true
    }))
  },
  getAlbumData (data) { // 获取对应活动相册数据
    return db.handleRequest(db.request.get('getActAlbum.php', {
      params: data,
      showLoading: true
    }))
  },
  postAlbumData (data) { // 上传提交数据
    return db.handleRequest(db.request.post('getupload.php', {
      data: data,
      showLoading: true
    }))
  },
  getApplyInfo (data) { // 获取报名信息
    return db.handleRequest(db.request.get('getApplyInfo.php', {
      params: data,
      showLoading: true
    }))
  },
  postApplyInfo (e) { // 提交报名信息
    let data = serializeObject(e)
    return db.handleRequest(db.request.post('postApplyInfo.php', {
      data: data,
      showLoading: true
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
