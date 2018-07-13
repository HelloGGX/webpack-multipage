//import BMap from 'BMap'
import weui from 'weui.js'

const baiduPromise =new Promise(function(resolve, reject){
  window._px ={
      resolve: resolve
  }
})
window._initBaiduMap =function(){
  window._px.resolve()
}

export default new Promise((resolve, reject) => {
  
  let district = window.sessionStorage.getItem('district')
    if (district) {
        let city = document.getElementById('city')
        city.innerHTML = district
    } else {
      const $script = document.createElement('script')
      global.document.body.appendChild($script)
      $script.src = 'http://api.map.baidu.com/api?v=2.0&ak=3A9cFQKXnMQbDo8IfKebDFZDXFQ6s9jR&callback=_initBaiduMap'
      
      baiduPromise.then(function(){
        let map
        // 百度地图API功能
        let BMap = window.BMap
        map = new BMap.Map('allmap')
        var point = new BMap.Point(116.331398, 39.897445)
        map.centerAndZoom(point, 12)
        var geoc = new BMap.Geocoder()
        var geolocation = new BMap.Geolocation()
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
             var mk = new BMap.Marker(r.point)
             map.addOverlay(mk)
             map.panTo(r.point)
            var pt = new BMap.Point(r.point.lng, r.point.lat)
    
            geoc.getLocation(pt, function (rs) {
              var addComp = rs.addressComponents
              window.sessionStorage.setItem('district', addComp.district)
              //console.log(addComp)
              resolve(addComp)
              
            // alert(fullName);
            })
          } else {
            weui.alert('failed' + this.getStatus())
          }
        }, {enableHighAccuracy: true})
      })
    } 
  
})
