import './store-list.less'


! function(b) {
    const navdata = [
        { "id": 1, "text": "首页" },
        { "id": 2, "text": "服饰" },
        { "id": 3, "text": "鞋包" },
        { "id": 4, "text": "百货" },
        { "id": 5, "text": "母婴" },
        { "id": 6, "text": "内衣" },
        { "id": 7, "text": "食品" },
        { "id": 8, "text": "电气" },
        { "id": 9, "text": "男装" },
        { "id": 10, "text": "水果" },
        { "id": 11, "text": "家纺" },
        { "id": 12, "text": "手机" },
        { "id": 13, "text": "汽车" }
    ]
    const storedata = [{
            "id": 1,
            "imgsrc": "//img.alicdn.com/bao/uploaded/i4/1910949384/TB1k_WRaEo09KJjSZFDXXb9npXa_!!0-item_pic.jpg_400x400Q50s50.jpg_.webp",
            "name": "  唯一视觉旅拍婚纱摄影三亚丽江泰国普吉岛巴厘岛婚纱照拍摄工作室 ",
            "distance": 300,
            "marprice": 168,
            "disprice": 29.8
        },
        {
            "id": 1,
            "imgsrc": "//img.alicdn.com/bao/uploaded/i4/1910949384/TB1k_WRaEo09KJjSZFDXXb9npXa_!!0-item_pic.jpg_400x400Q50s50.jpg_.webp",
            "name": "  唯一视觉旅拍婚纱摄影三亚丽江泰国普吉岛巴厘岛婚纱照拍摄工作室 ",
            "distance": 300,
            "marprice": 168,
            "disprice": 29.8
        },
        {
            "id": 1,
            "imgsrc": "//img.alicdn.com/bao/uploaded/i4/1910949384/TB1k_WRaEo09KJjSZFDXXb9npXa_!!0-item_pic.jpg_400x400Q50s50.jpg_.webp",
            "name": "  唯一视觉旅拍婚纱摄影三亚丽江泰国普吉岛巴厘岛婚纱照拍摄工作室 ",
            "distance": 300,
            "marprice": 168,
            "disprice": 29.8
        },
        {
            "id": 1,
            "imgsrc": "//img.alicdn.com/bao/uploaded/i4/1910949384/TB1k_WRaEo09KJjSZFDXXb9npXa_!!0-item_pic.jpg_400x400Q50s50.jpg_.webp",
            "name": "  唯一视觉旅拍婚纱摄影三亚丽江泰国普吉岛巴厘岛婚纱照拍摄工作室 ",
            "distance": 300,
            "marprice": 168,
            "disprice": 29.8
        }
    ]
    const DIRECTION_H = 'horizontal'
    const DIRECTION_V = 'vertical'
    b.scrollNav = {
        probeType: 1,
        click: true,
        direction: 'horizontal',
        startY: 0,
        startX: 0,
        init() {
            let thi = this;
            this._initNavWidth();
            this.initScroll();
            $('body').on('click', '.nav-bar-item', function(e) {
                thi._selectNav(this)
                $(this).find('span').addClass('nbi-selected').parent().siblings().find('span').removeClass('nbi-selected');

            })
        },
        initScroll() {
            let options = {
                probeType: this.probeType,
                click: this.click,
                scrollY: this.direction === DIRECTION_V,
                scrollX: this.direction === DIRECTION_H,
                startX: this.startX,
                startY: this.startY
            }
            this.scroll = new BScroll.default('.list-wrapper', options)
        },
        _initNavWidth() {
            let len = $('#navbar-ul').find('li').length;
            let liWidth = $('#navbar-ul').find('li').width() + 20;
            let allWidth = liWidth * len + 'px';
            $('#navbar-ul').width(allWidth)
        },
        _selectNav(thi) {
            this.current = $(thi).data('index')
            this._adjust($(thi).data('index'))
        },
        _adjust(tabId) {
            const viewportWidth = document.getElementsByClassName('viewport')[0].clientWidth
            const tabListWidth = document.getElementById('navbar-ul').clientWidth
            const minTranslate = Math.min(0, viewportWidth - tabListWidth)
            const middleTranslate = viewportWidth / 2
            const items = document.getElementById('navbar-ul').children
            let width = 0
            navdata.every((item, index) => {
                if (item.id === tabId) {
                    return false
                }
                width += items[index].clientWidth + 25
                return true
            })
            let translate = middleTranslate - width
            translate = Math.max(minTranslate, Math.min(0, translate))
            $('.scroll-content').css({
                    "transform": "translate(" + translate + 'px' + ", 0px)",
                    "transition-duration": "300ms"
                })
                //this.scroll && this.scroll.scrollTo(translate, 0, 300)
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        }
    }
    b.scrollList = {
        probeType: 1,
        click: true,
        direction: 'vertical',
        startY: 0,
        startX: 0,
        pullDownRefresh: true,
        pullUpLoad: true,
        pullDownInitTop: -50,
        data() {
            return {
                beforePullDown: true,
                isRebounding: false,
                isPullingDown: false,
                isPullUpLoad: false,
                pullUpDirty: true,
                pullDownStyle: ''
            }
        },
        init() {
            this.initScroll();
            setTimeout(() => {
                this.forceUpdate(true)
            }, 20)
        },
        initScroll() {
            let thi = this
            if (!$('.store-wrapper')) {
                return
            }
            let options = {
                probeType: this.probeType,
                click: this.click,
                scrollY: this.direction === DIRECTION_V,
                scrollX: this.direction === DIRECTION_H,
                pullDownRefresh: this.pullDownRefresh,
                pullUpLoad: this.pullUpLoad,
                startY: this.startY,
                startX: this.startX,
            }
            this.scroll = new BScroll.default('.store-wrapper', options)
            if (thi.pullDownRefresh) {
                thi._initPullDownRefresh();
            }

        },
        _initPullDownRefresh() {
            let thi = this
            this.scroll.on('pullingDown', () => {
                thi.data().beforePullDown = false;
                thi.data().isPullingDown = true;
                $('#pulldown').show();
                $('.before-trigger').hide();
                $('.after-trigger').show();
                $('.loading').show();
            })
            this.scroll.on('scroll', (pos) => {
                if (thi.data().beforePullDown) {
                    thi.data().pullDownStyle = `top:${Math.min(pos.y + thi.pullDownInitTop, 10)}px`;
                    document.getElementsByClassName('pulldown-wrapper')[0].style.cssText = thi.data().pullDownStyle;
                }

                if (thi.data().isRebounding) {
                    thi.data().pullDownStyle = `top:${10 - (thi.pullDownRefresh.stop - pos.y)}px`
                    document.getElementsByClassName('pulldown-wrapper')[0].style.cssText = thi.data().pullDownStyle;
                }
            })

        },
        _reboundPullDown() {
            const { stopTime = 600 } = thi.pullDownRefresh
            return new Promise((resolve) => {
                setTimeout(() => {
                    thi.data().isRebounding = true
                    this.scroll.finishPullDown()
                    resolve()
                }, stopTime)
            })
        },
        _afterPullDown() {
            setTimeout(() => {
                this.data().pullDownStyle = `top:${thi.pullDownInitTop}px`;
                document.getElementsByClassName('pulldown-wrapper')[0].style.cssText = this.data().pullDownStyle;
                this.data().beforePullDown = true
                this.data().isRebounding = false
                this.refresh()
            }, this.scroll.options.bounceTime)
        },
        refresh() {
            this.scroll && this.scroll.refresh();
        },
        forceUpdate(dirty) {
            if (this.pullDownRefresh && this.data().isPullingDown) {
                this.data().isPullingDown = false;
                $('loading').hide();
                this._reboundPullDown().then(() => {
                    this._afterPullDown()
                })
            } else {
                this.refresh()
            }
        }
    }
    b.filter = {
        init() {
            this._select();
        },
        _select() {
            $('.o_item').on('click', function() {

                if ($(this).index() === 0) {
                    if ($('.filter-extend').hasClass('open')) {
                        $('.filter-extend').removeClass('open')
                    } else {
                        $('.filter-extend').addClass('open')
                    }

                }
                $(this).addClass('o_cur').siblings().removeClass('o_cur');
            })
            $('.filter-extend li').on('click', function() {
                $(this).addClass('active').siblings().removeClass('active');
            })
        }
    }
    b.Home = {
        pageInit: function() {
            Home.navbarInit();
            Home.storeInit();
            scrollNav.init();
            scrollList.init();
            filter.init();
        },
        navbarInit: function() { //初始化导航条的数据

            let _html = '',
                len = navdata.length;
            for (let i = 0; i < len; i++) {
                _html += '<li class="nav-bar-item" data-index=' + navdata[i].id + '>\
                    <span>' + navdata[i].text + '</span>\
                </li>'
            }
            $('#navbar-ul').html(_html);
            $('#navbar-ul li').eq(0).find('span').addClass('nbi-selected')

        },
        storeInit: function() { //初始化门店信息
            let _html = '',
                len = storedata.length;
            for (let i = 0; i < len; i++) {
                _html += '<div class="store-item" data-id=' + storedata[i].id + '>\
                <div class="store-content">\
                    <div class="goods-image">\
                        <div class="image-container">\
                            <img src=' + storedata[i].imgsrc + ' alt="">\
                        </div>\
                    </div>\
                    <div class="goods-detail">\
                        <p class="goods-name">' + storedata[i].name + '</p>\
                        <div class="goods-content">\
                            <p class="goods-sales">距离' + storedata[i].distance + '米</p>\
                        </div>\
                        <del class="goods-market-price">' + storedata[i].marprice + '</del>\
                        <div class="discount-price"><i>￥</i>' + storedata[i].disprice + '</div>\
                        <div class="goods-buy">立即抢</div>\
                    </div>\
                </div>\
            </div>'
            }
            $('.stores').html(_html);
        }
    }
}(window);


$(function() {

    Home.pageInit();

})