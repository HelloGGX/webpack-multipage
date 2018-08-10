import {serializeObject} from 'common/js/dom'
import db from '../db/db'
let person = {// 个人资料管理（资料获取，编辑）
  getPerData (data) { // 获取用户资料
    return db.handleRequest(db.request.get('getPerData.php', {
      params: data,
      showLoading: true
    }))
  },
  postPerData (e) { // 提交用户资料
    let data = serializeObject(e)
    return db.handleRequest(db.request.post('postPerData.php', {
      data: data,
      showLoading: true
    }))
  },
  postIdData (e) { // 身份认证
    let data = serializeObject(e)
    return db.handleRequest(db.request.post('postIdData.php', {
      data: data,
      showLoading: true
    }))
  },
  postBankData (e) { // 设置银行账户信息
    let data = serializeObject(e)
    return db.handleRequest(db.request.post('postBankData.php', {
      data: data,
      showLoading: true
    }))
  },

  postCash (e) { // 提交提现信息
    let data = serializeObject(e)
    return db.handleRequest(db.request.post('postCashData.php', {
      data: data,
      showLoading: true
    }))
  }

}

let travel = {// 游记相关
  postTravel (e) { // 提交游记
    let data = serializeObject(e)
    console.log(data)
    return db.handleRequest(db.request.post('postTravel.php', {
      data: data,
      showLoading: true
    }))
  },
  linkAct (data) { // 关联活动
    return db.handleRequest(db.request.get('linkAct.php', {
      params: data,
      showLoading: true
    }))
  },
  getMyClub (data) { // 获取用户所在俱乐部信息
    return db.handleRequest(db.request.get('getMyClub.php', {
      params: data,
      showLoading: true
    }))
  },
  getTravelList (data) {
    return db.handleRequest(db.request.get('getTravelList.php', {
      params: data,
      showLoading: true
    }))
  },
  getTravelDetail (data) {
    return db.handleRequest(db.request.get('getTravelDetail.php', {
      params: data,
      showLoading: true
    }))
  }
}

let magAct = {// 管理活动
  cancelApply (data) { // 报名成员取消报名
    return db.handleRequest(db.request.post('cancelApply.php', {
      data: data,
      showLoading: true
    }))
  },
  editApply (e) { // 修改报名成员填写信息
    let data = serializeObject(e)
    return db.handleRequest(db.request.post('editApply.php', {
      data: data,
      showLoading: true
    }))
  },
  getApplyHelp (data) { // 获取帮报的成员信息
    return db.handleRequest(db.request.get('getApplyHelp.php', {
      params: data,
      showLoading: true
    }))
  },
  getActInfoData (data) { // 获取活动信息数据
    return db.handleRequest(db.request.get('getActDetail.php', {
      params: data,
      showLoading: true
    }))
  },
  deleteAct (id) { // 删除活动
    return db.handleRequest(db.request.delete('act_delete.php', {
      params: {
        id: id
      }
    }))
  },
  openApply (data) { // 打开或者关闭活动
    return db.handleRequest(db.request.post('openApply.php', {
      data: data,
      showLoading: true
    }))
  },
  updateAct (e) { // 编辑更新活动
    let data = serializeObject(e)
    return db.handleRequest(db.request.post(`updateAct.php`, {
      data: data,
      showLoading: true
    }))
  },
  addPer (e) { // 添加报名成员
    let data = serializeObject(e)
    return db.handleRequest(db.request.post('addPer.php', {
      data: data,
      showLoading: true
    }))
  },
  editPer (e) {
    let data = serializeObject(e)
    console.log(data)
    return db.handleRequest(db.request.post('editPer.php', {
      data: data,
      showLoading: true
    }))
  },
  getPer (data) { // 获取未分组报名人员信息
    return db.handleRequest(db.request.get('getPer.php', {
      params: data,
      showLoading: true
    }))
  },
  reviewPer (data) { // 审核人员
    return db.handleRequest(db.request.post('reviewPer.php', {
      data: data,
      showLoading: true
    }))
  },
  moveToGroup (data) { // 移动人员到相应组
    return db.handleRequest(db.request.post('moveToGroup.php', {
      data: data,
      showLoading: true
    }))
  },
  getGroupPer (data) { // 获取该组成员
    return db.handleRequest(db.request.post('getGroupPer.php', {
      data: data,
      showLoading: true
    }))
  },
  getPerApplyOpt (data) { // 获取用户报名选项
    return db.handleRequest(db.request.get('getPerApplyOpt.php', {
      params: data,
      showLoading: true
    }))
  },
  addGroup (data) { // 新增组
    return db.handleRequest(db.request.post('addGroup.php', {
      data: data,
      showLoading: true
    }))
  },
  deletGroup (data) { // 删除组
    console.log(data)
    return db.handleRequest(db.request.post('deleteGroup.php', {
      data: data,
      showLoading: true
    }))
  },
  editGroup (data) { // 编辑组名字
    console.log(data)
    return db.handleRequest(db.request.post('editGroup.php', {
      data: data,
      showLoading: true
    }))
  }
}

let orders = {// 订单
  getReceipt (data) { // 获取活动订单收款信息
    return db.handleRequest(db.request.get('getReceipt.php', {
      params: data,
      showLoading: true
    }))
  },
  getOrderData (data) { // 获取订单数据
    return db.handleRequest(db.request.get('getOrderData.php', {
      params: data,
      showLoading: true
    }))
  },
  cancelOrder (data) { // 取消订单
    return db.handleRequest(db.request.post('cancelOrder.php', {
      data: data,
      showLoading: true
    }))
  },
  deleteOrder (data) { // 删除订单
    return db.handleRequest(db.request.delete('deleteOrder.php', {
      params: data,
      showLoading: true
    }))
  },
  getRefund (data) { // 获取退款
    return db.handleRequest(db.request.get('getRefund.php', {
      params: data,
      showLoading: true
    }))
  },
  refund (data) { // 退款申请通过还是不通过
    return db.handleRequest(db.request.post('refund.php', {
      data: data,
      showLoading: true
    }))
  }
}

let sign = {// 签到
  getSign (data) { // 获取申请为俱乐部的成员
    return db.handleRequest(db.request.get('getSign.php', {
      params: data,
      showLoading: true
    }))
  },
  postSign (data) { // 审核俱乐部成立申请
    return db.handleRequest(db.request.post('postSign.php', {
      data: data,
      showLoading: true
    }))
  }
}

let mag = {// 管理员管理审核
  getCheckClub (data) { // 获取申请为俱乐部的成员
    return db.handleRequest(db.request.get('getCheckClub.php', {
      params: data,
      showLoading: true
    }))
  },
  checkClub (data) { // 审核俱乐部成立申请
    return db.handleRequest(db.request.post('checkClub.php', {
      data: data,
      showLoading: true
    }))
  },
  getMember (data) { // 获取俱乐部成员
    return db.handleRequest(db.request.get('getMember.php', {
      params: data,
      showLoading: true
    }))
  },
  checkMember (data) { // 审核俱乐部成员
    return db.handleRequest(db.request.post('checkMember.php', {
      data: data,
      showLoading: true
    }))
  }
}

let pay = {// 支付相关
  postPayData (e) { // 设置支付账户信息
    let data = serializeObject(e)
    return db.handleRequest(db.request.post('postPayData.php', {
      data: data,
      showLoading: true
    }))
  },
  getPayData (data) { // 获取支付账户信息
    return db.handleRequest(db.request.get('getPayData.php', {
      params: data,
      showLoading: true
    }))
  }
}
export default {
  magAct,
  person,
  orders,
  travel,
  pay,
  mag,
  sign,
  deleteAlbums (data) { // 删除相册
    return db.handleRequest(db.request.post('deleteAlbums.php', {
      data: data,
      showLoading: true
    }))
  },
  getAlbums (data) { // 获取相册
    return db.handleRequest(db.request.get('getAlbums.php', {
      params: data,
      showLoading: true
    }))
  },
  postAlbum (data) { // 创建相册
    return db.handleRequest(db.request.post('postAlbum.php', {
      data: data,
      showLoading: true
    }))
  },
  search (data) { // 搜索
    return db.handleRequest(db.request.post('search.php', {
      data: data,
      showLoading: true
    }))
  },
  postCoin (data) { // 渡币兑换商城积分
    return db.handleRequest(db.request.post('postCoin.php', {
      data: data,
      showLoading: true
    }))
  },
  getCoin (data) { // 获取渡币兑换商城积分记录
    return db.handleRequest(db.request.get('getCoin.php', {
      params: data,
      showLoading: true
    }))
  },
  postAddr (data) {
    return db.handleRequest(db.request.post('postAddr.php', {
      data: data,
      showLoading: true
    }))
  },
  getMagInfo (data) { // 获取活动详情数据和报名选项数据
    return db.handleAll([this.getActDetailData(data), this.getApplyData(data)])
  },
  getPerApplyData (data) { // 获取用户填写的数据
    return db.handleRequest(db.request.get('getPerApplyData.php', {
      params: data,
      showLoading: true
    }))
  },
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

  getIndexData (data) { // 获取首页数据
    return db.handleRequest(db.request.get('getIndex.php', {
      params: data,
      showLoading: true
    }))
  },
  postUserData (data) { // 获取首页数据,发送用户信息
    return db.handleRequest(db.request.post('postUserData.php', {
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
  getMyAlbumData (data) { // 获取我的花絮相册数据
    return db.handleRequest(db.request.get('getMyAlbumData.php', {
      params: data,
      showLoading: true
    }))
  },
  getApplyInfo (data) { // 活动管理列表获取报名信息列表
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
  },
  getApplySuccess (data) { // 报名成功后获取相关信息
    return db.handleRequest(db.request.get('getApplySucess.php', {
      params: data,
      showLoading: true
    }))
  },
  signOut (data) { // 退出登录
    return db.handleRequest(db.request.post('signOut.php', {
      params: data,
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
