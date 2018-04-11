import './activity.less'
import {getActData} from 'api/getIndex'


!function(b){
    let TYPE="city";
    b.Home = {
        pageInit: function() { 
          Home._getNewData();
          Home.switch();
        },
        _temple:function(i,data){//模板
            return '<div class="store-item" data-id='+data[i].id+'>\
            <div class="store-content">\
                <div class="goods-image">\
                    <div class="image-container">\
                        <img src='+data[i].imgsrc+' alt="">\
                    </div>\
                </div>\
                <div class="goods-detail">\
                    <p class="goods-name">'+data[i].name+'</p>\
                    <div class="goods-content">\
                        <p class="goods-sales">活动时间'+data[i].time+'</p>\
                    </div>\
                    <del class="goods-market-price">'+data[i].price+'</del>\
                    <div class="discount-price"><i>￥</i>'+data[i].price+'</div>\
                    <div class="goods-buy">立即查看</div>\
                </div>\
            </div>\
            </div>'  
        },
        _getNewData:function(){
            getActData().then(function(data){
                    let newdata;
                    let _html='';
                     newdata = data[TYPE];
                     let len = newdata.length;
                     for(let i=0;i<len;i++){
                         _html+= Home._temple(i,newdata)
                     }
                     $('#act-grid').append("<li class='goods_grid_wrapper stores' id="+TYPE+" data-type="+TYPE+"></li>")
                     $('#'+TYPE).append(_html)
                     $(document.getElementById(TYPE)).show().siblings().hide();
            }).catch(function(ErrMsg){
                 //获取数据失败时的处理逻辑
             })
        },
        switch:function(){
            $('.nav_fixed_catgoods').on('click','.fixed_nav_item_catgoods',function(){
                $(this).find('span').addClass('nav_cur_cat').parent().siblings().find('span').removeClass('nav_cur_cat');
                TYPE = $(this).data('type')
                if(document.getElementById(TYPE)){
                    $(document.getElementById(TYPE)).show().siblings().hide();
                }else{
                    Home._getNewData()
                }
               
            })
        }
    }
}(window);

$(function() {
    Home.pageInit();
})