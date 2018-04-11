export function getIndexData (data) {//获取首页数据
    const url = "/src/api/getIndex.json"
    
    return axios.get(url,{
        params:data
    })
    .then((res)=>{
        return Promise.resolve(res.data)
    }).catch((error)=>{
        return Promise.reject(error.data)
    })
    // return new Promise(function(resolve,reject){
    //     $.ajax({
    //         type:"GET",
    //         url:url,
    //         success:function(data){
    //             if(data){//这里应该是data.Status=="1",到时候后台提供api的时候改
    //                 resolve(data)//在异步操作成功时调用
    //             }else{
    //                 reject(data.ErrMsg);//在异步操作失败时调用
    //             }
    //         }
    //     });
    // })
  };

  export function getActData (data) {//获取活动页面数据
    const url = "/src/api/getAct.json"
    
    return axios.get(url,{
        params:data
    })
    .then((res)=>{
        return Promise.resolve(res.data)
    }).catch((error)=>{
        return Promise.reject(error.data)
    })
  }
  