import 'common/css/reset.less'
import 'common/css/base.less'
import 'common/css/iconfont.css'
import 'weui'

let scroll={
    init(){
        let options = {
            probeType: 1,
            click: true,
            scrollY: true,
            scrollX: false,
            startX:0,
            startY: 0
        }
        this.scroll = new BScroll.default('.content-wrapper', options)
    }
}
$(function() {
    scroll.init();
})
