(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{1:function(t,e){t.exports=libs},31:function(t,e,a){"use strict";a(66),a(62);var n=c(a(0)),l=c(a(5)),s=c(a(2)),i=c(a(4));function c(t){return t&&t.__esModule?t:{default:t}}var o,u=(o={currentIndex:0,scrol:new l.default(".content-wrapper",{probeType:3,click:!0}),init:function(){var t=this,e=document.getElementsByClassName("v5-banner")[0].clientHeight;document.getElementsByClassName("act-list")[0].style.top=e+"px",(0,n.default)(".go-top").on("click",function(e){t.toTop()}),(0,n.default)(".header-nav li").on("click",function(e){t.navSwitch(e)}),this.scrolling(e)},navSwitch:function(t){var e=(0,n.default)(t.currentTarget).data("index");(0,n.default)(t.currentTarget).addClass("active").siblings().removeClass("active"),this.scrol.scrollToElement(document.getElementsByClassName("flagIndex")[e],100,!1,260)},toTop:function(){this.scrol.scrollToElement(document.getElementsByClassName("act-list")[0],100,!1,0)},moveScroll:function(t){var e=(0,n.default)(".banner-container"),a=(0,n.default)(".go-top");isNaN(t)||(-t<340?a.addClass("top-button-hide").removeClass("top-button-show"):a.removeClass("top-button-hide").addClass("top-button-show"),-t<240?e.addClass("banner-fade").find(".banner-tit").hide():e.removeClass("banner-fade").find(".banner-tit").show())},getOffsetTopIndex:function(t,e){return(0,n.default)((0,n.default)("."+t)[e]).offset().top},scrolling:function(t){for(var e=this,a=(0,n.default)(".flagIndex").length,l=[],s=0;s<a;s++)l.push(this.getOffsetTopIndex("flagIndex",s));this.scrol.on("scroll",function(s){for(var i=s.y,c=0;c<a;c++)-i>=l[c]&&(0,n.default)((0,n.default)(".header-nav li")[c]).addClass("active").siblings().removeClass("active");e.moveScroll(i),(0,n.default)(".bg-layer").css({transform:"translate3d(0,"+i+"px,0)"});var o=Math.abs(i/t),u=0,d=1;i>0&&(d=1+o,u=10),(0,n.default)(".v5-banner").css({"z-index":u,transform:"scale("+d+")"})})}},{pageInit:function(){o.init(),this._getActDetailData()},_getActDetailData:function(){i.default.getActDetailData().then(function(t){var e=t.list[0].hd_thumb_url,a=t.list[0].price,l=t.club.club_name,s=t.club.club_member,i=t.club.club_acts,c=t.list[0].act_name,o=t.list[0].act_type,u=t.list[0].act_addr,d=t.list[0].act_time,r=t.list[0].act_integral,f=t.list[0].sales,m=t.list[0].sales_limit,p=t.club_recent_act,g=t.list[0].act_should_know,h=t.list[0].act_detail_text,v=t.list[0].act_detail_imgs;(0,n.default)(".v5-banner").css({"background-image":"url("+e+")"}),(0,n.default)(".index_price").html(a),(0,n.default)(".g-repeated-coupon-tag").html(l),(0,n.default)("#index_name").html(c),(0,n.default)(".g-service-list").html(""+o.map(function(t){return'<span class="g-service-item">'+t+"</span>"})),(0,n.default)(".goods-mall-name").html(l),(0,n.default)(".goods-mall-info span:first").html("活动数量&nbsp;"+i),(0,n.default)(".goods-mall-info span:last").html("会员数量&nbsp;"+s),(0,n.default)("input[name=MeetingPlace]").val(u),(0,n.default)("input[name=MeetingTime]").val(d),(0,n.default)("input[name=actStar]").val(r),(0,n.default)("input[name=applyPeople]").val(f+"/"+m),(0,n.default)(".mall-recommend-main ul").html("\n          "+p.map(function(t){return'<li class="mall-recommend-item">\n            <img src="'+t.thumb_url+'">\n            <span class="mr-goods-name">\n              '+t.act_name+'\n            </span>\n            <div class="mr-goods-detail">\n              <span class="mr-price">\n                <i> ￥</i>\n                '+t.price+"\n              </span>\n            </div>\n          </li>"})+"\n        "),(0,n.default)("#notice").html(g),(0,n.default)("#detailText").html(h),(0,n.default)(".act-detail-img").html("\n        "+v.map(function(t){return'\n        <li class="gd-item">\n        <img src="'+t+'" alt="">\n    </li>\n        '})+"\n        ")}).catch(function(t){s.default.alert(t)})}});(0,n.default)(function(){u.pageInit()})},66:function(t,e){}},[[31,1,2]]]);