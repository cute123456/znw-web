import Vue from 'vue'
// import { Swiper, SwiperItem } from 'vux'
import Swiper from 'vux/src/components/swiper/swiper.vue'
import SwiperItem from 'vux/src/components/swiper/swiper-item.vue'
import Cell from 'vux/src/components/cell/index.vue'
import Group from 'vux/src/components/group/index.vue'
import XNumber from 'vux/src/components/x-number/index.vue'
import XSwitch from 'vux/src/components/x-switch/index.vue'
import Divider from 'vux/src/components/divider/index.vue'
import Rater from 'vux/src/components/rater/index.vue'
import Popup from 'vux/src/components/popup/index.vue'
import XButton from 'vux/src/components/x-button/index.vue'
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
import { Toast } from 'vue-ydui/dist/lib.px/dialog';
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
    toast: Toast,
};

export default {
    components: {
        Swiper,
        SwiperItem,
        Cell,
        XNumber,
        Group,
        XSwitch,
        Divider,
        Popup,
        XButton,
        Checker,
        CheckerItem,
        Rater
    },
    data() {
        return {
            message: '', // 留言
            is_attention: 1, // 是否关注了公众号，默认关注了
            show1: false,
            lists: [], // 轮播图
            money: '',
            data: { // 商品详情
                business: {
                    b_audit: 1,
                    b_city: "南昌市",
                    b_county: "青山湖区",
                    b_description: null,
                    b_detail_address: "北京东路锦海东方银座",
                    b_img: "upload/d1750fd604a4892b4484e23fe0ac8ca0.jpg",
                    b_mobile: 13265308041,
                    b_name: "微聚玩具专营店",
                    b_province: "江西",
                    b_routine_beans: "0.10",
                    b_routine_fee: "0.10",
                    b_type: 1,
                    b_uid: 1417,
                    b_uname: "李顺 ",
                    b_use_beans: 1,
                    b_yratio: "1.000",
                    created_at: "2018-03-22 14:32:51",
                    id: 172,
                    updated_at: "2018-03-22 14:33:15"
                },
                admin_off_shelve: 0,
                created_at: "2018-03-22 14:41:20",
                g_bid: 172,
                g_class_id: 172,
                g_count: 299,
                g_daygroom: 0,
                g_description: "<p>微聚优教百变托马斯轨道车拼装电动极速轨道儿童益智玩具创意diy玩具 快乐童年 快乐生活 自由组装，锻炼孩子想象力</p>",
                g_freight: 0,
                g_input_farclass: null,
                g_input_kidclass: null,
                g_isapproval: 1,
                g_isexpress: 1,
                g_isgroom: 0,
                g_isknock: 0,
                g_isoffline: 0,
                g_isyishop: 0,
                g_name: "百变托马斯轨道车拼装电动轨道儿童益智玩具创意diy玩具",
                g_pic: "upload/85ebc4cd1ffd463836e929572daab4c4.jpg",
                g_pics: "upload/72c4b895b0e77997e96078ba88b68990.jpg,upload/30170b0dd73e8aae3c12b218faf4e229.jpg,upload/8f00d1910226cc395e9015c2cc4555f7.jpg,upload/6d2dd30c44688313483f8d4dd97d3e16.png",
                g_price: "29.90",
                g_routine_beans: "0.10",
                g_routine_fee: "0.10",
                g_sales: 1,
                g_sales_add: 0,
                g_total: 0,
                g_yend_time: null,
                g_yprice: 30,
                g_yratio: "1.000",
                g_ystar_time: null,
                goodsStyle: [],
                hidden_price: 0,
                id: 453,
                is_join_yigoods: 1,
                off_shelve: 1,
                review_count: 0,
                updated_at: "2018-04-01 16:08:33"
            },
            list: { // 评论列表
                user_review: {}
            },
            popupVisible: false, // 弹出框
            isChoice: false, // 选择规格,已选择规格切换
            goodQuent: 1, //购物车里面商品对应的的数量
            quentity: 1, //商品数量
            model: {}, // 选择的规格
            oldMoney: '', // 原价
            model_id: '', // 选中的规格
            oldYnum: '', // 原易豆价,
            popBtn: 2, // 弹框底部按钮文字,默认立即下单
            shopCar: {},
            uid: localStorage.getItem('uid'), // 用户id
            offline: '', //是线下还是线上的商品，1代表线下，0 是线上
            collectFlag: false, //是否收藏
        }
    },
    computed: {
        guigePrice() { // 规格价钱之和
            let temp = 0
            for (let i in this.model) {
                if (this.model[i] != '') {
                    temp = temp + parseFloat(this.model[i].ty_price)
                }
            }
            return parseFloat(temp).toFixed(2)
        },
        guigeNum() { // 选中的规格的数量
            let num = 0
            for (let i in this.model) {
                if (this.model[i] != '') {
                    num++
                }
            }
            return num
        },
        orderStorage: function() { // 要去下单的商品信息
            this.shopCar[this.data.business.id][this.data.id].quentity = this.quentity
            this.shopCar[this.data.business.id][this.data.id].model = this.model
            this.shopCar[this.data.business.id][this.data.id].uid = this.uid
            return this.shopCar
        },
    },
    methods: {

        point() {
            //查看用户是否关注了公众号
            if (this.is_attention != 1) { // 没有关注公众号
                this.show1 = true
                return
            }

            //进行预约
            this.show2 = true

        },
        attention() { // 获取公众号是否被关注
            this.axios.get('/access/token', {
                params: {
                    openid: localStorage.getItem('openid')
                }
            }).then(res => {
                this.is_attention = res.data.datas
            })
        },
        getPhone(phone) { // 获取加密电话号
            if (!phone) {
                return '载入中'
            } else {
                return phone.substring(0, 3) + '****' + phone.substring(7, 11)
            }
        },
        getDate(date) { // 获取年月日的日期
            if (!date) {
                return '载入中'
            } else {
                return date.split(' ')[0]
            }
        },
        getLength(length) { // 获取长度
            if (length > 0) {
                return true
            } else {
                return false
            }
        },
        close() { // 关闭规格弹窗
            this.popupVisible = false
            this.totalMoney()
        },
        changeSize() { // 切换规格
            this.totalMoney()
            this.isChoice = true
        },
        changeQuentity(num) { // 加减按钮加减数量
            if (num > 0 && this.quentity < this.data.g_count) {
                this.quentity++;
            } else if (num > 0 && this.quentity >= this.data.g_count) {
                this.$dialog.toast({ mes: '库存不足' });
            } else {
                if (this.quentity > 1) {
                    this.quentity--;
                }
            }
            this.totalMoney()
        },
        totalMoney() { // 计算总价
            this.money = this.data.g_price // 商品原始价
            if (this.data.goodsStyle.length > 0) { // 如果有规格
                let single = parseFloat(this.guigePrice)
                this.money = parseFloat(single * this.quentity).toFixed(2)
            } else { // 如果无规格
                this.money = parseFloat(this.money * this.quentity).toFixed(2)
            }
        },
        readShop() { // 读取本地购物车
            this.shopCar = JSON.parse(localStorage.getItem('shopCar'));
            if (!this.shopCar) { // 初始化对象
                return
            } else if (!this.shopCar[this.data.business.id]) {
                return
            } else {
                if (this.shopCar[this.data.business.id].goods[this.data.id]) {
                    this.quentity = this.shopCar[this.data.business.id].goods[this.data.id].quentity
                }
            }

        },
        addShop() { // 加入购物车
            console.log('1111111111111111')
            if (this.data.g_count <= 0) {
                this.$dialog.toast({ mes: '库存不足' });
                return;
            }
            let tempCar = JSON.parse(localStorage.getItem('shopCar'));
            if (!tempCar) {
                tempCar = {}
            }
            if (!tempCar[this.data.business.id]) { //shopCar下标为店铺id,里面放置店铺名和商品对象
                tempCar[this.data.business.id] = {
                    name: this.data.business.b_name,
                    goods: {}
                }
            }
            tempCar[this.data.business.id].goods[this.data.id] = { // 商品对象
                businessId: this.data.business.id,
                id: this.data.id,
                quentity: this.quentity,
                model: this.model,
                price: this.money
            }
            localStorage.setItem('shopCar', JSON.stringify(tempCar));
            this.$dialog.toast({ mes: '添加成功', timeout: 1500 });
            this.close()
        },
        // 下单加入购物车
        appointment() {
            if (this.data.g_count <= 0) {
                this.$dialog.toast({ mes: '库存不足' });
                return;
            }
            let arr = [] // 规格长度
            this.data.goodsStyle.forEach(value => {
                if (value.goodsType.length > 0) {
                    arr.push(1)
                }
            })
            if (this.data.goodsStyle.length > 0 && this.guigeNum < arr.length) {
                this.$dialog.toast({ mes: '请选择规格', timeout: 1500 });
                return
            }
            if (this.popBtn != 1) { // 立即下单
                let temp = {}
                temp[this.data.business.id] = {}
                temp[this.data.business.id][this.data.id] = this.data
                temp[this.data.business.id][this.data.id].model = this.model
                temp[this.data.business.id][this.data.id].quentity = this.quentity; //商品数量
                temp[this.data.business.id][this.data.id].businessId = this.data.business.id
                temp[this.data.business.id][this.data.id].uid = localStorage.getItem('uid')
                    // this.axios.post('/order/add', {
                    //     goods: temp
                    // }).then(res => {
                    //     if (res.data.result) {
                this.$router.push('/shop/settlement?orderId=' + 1384)
                    //     } else {
                    //         this.$dialog.toast({ mes: res.data.message });
                    //     }
                    // })

            } else if (this.popBtn == 1) { // 加入购物车
                this.addShop()
            }
        },
        sendPoint() { //预约留言接口
            let arr = [] // 规格长度
            this.data.goodsStyle.forEach(value => {
                if (value.goodsType.length > 0) {
                    arr.push(1)
                }
            })
            if (this.data.goodsStyle.length > 0 && this.guigeNum < arr.length) {
                this.$dialog.toast({ mes: '请选择规格', timeout: 1500 });
                return
            }

            let typeIds = []
            for (let i in this.model) {
                typeIds.push(this.model[i].id)
            }

            this.axios.post('/offline/appointment', {
                openid: localStorage.getItem('openid'),
                bid: this.data.business.id,
                gid: this.data.id,
                remark: this.message ? this.message : '无',
                type_ids: typeIds.join(',')
            }).then(res => {
                if (res.data.result) {
                    this.$dialog.toast({ mes: "预约成功", timeout: 2000 })
                    this.popupVisible = false
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 2000 })
                }
            })
        },
        HSrc(value) { // 头像
            let http = value.indexOf('http');
            if (http > -1) {
                return value
            } else {
                return this.HTTP + value
            }
        },
        // getCollectStatus() { // 获取收藏状态
        //     this.axios.get('/collect/is', {
        //         params: {
        //             c_uid: localStorage.getItem('uid'),
        //             c_gid: this.$route.query.id
        //         }
        //     }).then(res => {
        //         if (res.data.result) {
        //             if (res.data.datas == -1) {
        //                 this.collectFlag = 0
        //             } else {
        //                 this.collectFlag = 1
        //             }
        //         } else {
        //             this.$dialog.toast({ mes: res.data.message, timeout: 1000 })
        //         }
        //     })
        // },
        collect() { // 收藏与取消收藏
            this.collectFlag = !this.collectFlag
            if (this.collectFlag) { // 收藏
                // this.axios.post('/collect/add', {
                //     c_uid: localStorage.getItem('uid'),
                //     c_gid: this.$route.query.id,
                //     c_bid: this.data.business.id,
                // }).then(res => {
                //     if (res.data.result) {
                //         this.$dialog.toast({ mes: '收藏成功', timeout: 1000 })
                //     } else {
                //         this.$dialog.toast({ mes: res.data.message, timeout: 1000 })
                //     }
                // })
            } else { // 取消收藏
                // this.axios.delete('/collect/remove', {
                //     params: {
                //         c_uid: localStorage.getItem('uid'),
                //         c_gid: this.$route.query.id,
                //     }
                // }).then(res => {
                //     if (res.data.result) {
                //         this.$dialog.toast({ mes: '取消宝贝收藏成功', timeout: 1000 })
                //     } else {
                //         this.$dialog.toast({ mes: res.data.message, timeout: 1000 })
                //     }
                // })
            }
        },
        shareGoods() {
            // 添加实例方法,微信分享
            setTimeout(() => {
                let that = this
                Vue.use(WechatPlugin)
                    // let openid=localStorage.getItem('openid')
                let url = window.location.href
                that.axios.get('/wechat/token', {
                    params: {
                        url: url
                    }
                }).then(res => { // 获得签名配置
                    var Data = res.data.datas;
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
                    that.$wechat.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: 'wx246a6ae36dab8bd5', // 必填，公众号的唯一标识
                        timestamp: Data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: Data.digit, // 必填，生成签名的随机串
                        signature: Data.signature, // 必填，签名，见附录1
                        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    })
                })

                that.$wechat.ready(() => {
                    console.log('产品数据', that.data)
                    console.log('名字', that.data.g_name)
                        // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
                        // 则可以直接调用，不需要放在ready函数中。
                    that.link = window.location.href
                        // console.log(that.link)
                    var wxtitle = '我在亿货惠淘到' + that.data.g_name + '你也快来看看吧' // 标题
                    var wximg = that.HTTP + that.data.g_pic
                    var wxlink = that.link
                    var wxdesc = '超划算' + that.data.g_name // 描述(分享给微信/QQ好友/微博时显示)
                    that.$wechat.onMenuShareAppMessage({ // 分享给朋友
                        title: wxtitle, // 分享标题
                        desc: wxdesc, // 分享描述
                        link: wxlink,
                        imgUrl: wximg, // 分享图标
                        // 用户确认分享后执行的回调函数
                        success: function() {
                            Toast({
                                mes: "恭喜分享成功",
                                timeout: 2000
                            });
                        },
                        // 用户取消分享后执行的回调函数
                        cancel: function() {
                            Toast({
                                mes: "分享到朋友取消",
                                timeout: 2000
                            });
                        }
                    });
                    //分享到朋友圈
                    that.$wechat.onMenuShareTimeline({
                        title: wxtitle, // 分享标题
                        desc: wxdesc, // 分享描述
                        link: wxlink,
                        // link: that.link,   // 分享链接
                        imgUrl: wximg, // 分享图标
                        // 用户确认分享后执行的回调函数
                        success: function() {
                            Toast({
                                mes: "分享到朋•••友圈成功",
                                timeout: 2000
                            });
                        },
                        // 用户取消分享后执行的回调函数
                        cancel: function() {
                            Toast({
                                mes: "分享到朋友圈取消",
                                timeout: 2000
                            });
                        }
                    });
                })
            }, 300);
        },
    },
    created() {
        this.attention() //获取是否关注了公众号
        this.offline = this.$route.query.g_isoffline

        this.axios.get('/goods/review', { // 获取评价
            params: {
                r_gid: this.$route.query.id,
                limit: 1,
                offset: 0
            }
        }).then(res => {
            if (res.result) {
                this.list = res.data.datas.rows[0]
            } else {
                this.list = []
            }
        })

        // this.axios.get('/goods/get', { // 获取详细信息
        //     params: {
        //         id: this.$route.query.id,
        //     }
        // }).then(res => {
        //     this.data = res.data.datas.goods
        this.oldMoney = this.data.g_price // 商品原始价
        this.oldYnum = Math.ceil(this.data.g_price * this.data.g_yratio) // 易豆原始价
        this.money = this.data.g_price // 规格弹框里的钱
        if (this.data.g_pics) { // 轮播图
            let list = this.data.g_pics.split(",")
            for (let i in list) {
                this.lists.push({ img: this.HTTP + list[i] });
            }
        }
        this.readShop()
        let good = this.data
        if (!this.shopCar) {
            this.shopCar = {}
        }
        this.shopCar[this.data.business.id] = {}
        this.shopCar[this.data.business.id][this.data.id] = good

        //     this.shareGoods() // 分享产品 

        // })

        // this.getCollectStatus() // 获取商品收藏状态
    },
}