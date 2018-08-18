import Vue from 'vue'
import Popup from 'vux/src/components/popup/index.vue'
import { Button } from 'vue-ydui/dist/lib.px/button'
import { Toast } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
    toast: Toast,
};
Vue.component(Button.name, Button)

export default {
    data: function() {
        return {
            is_attention: 1, // 是否关注了公众号，默认关注了
            show1: false,
            showPayMethods: false,
            activeName: '微信支付',
            orderId: [], // 获取的订单id
            orderDatas: [],
            orderInfo: {},
            total: '', // 地址列表总数
            addressList: [], // 地址列表数据
            orderPhone: '',
            orderLinker: '',
            wechatInfo: '',
            hasAddressFlag: '', //有地址的标志,默认显示默认地址，解决闪现
            level: '',
            discountPrice: '',
            discountFlag: false,
            balance: '',
            message: '', // 留言
            activeModel: [], // 商品选中的规格
            uid: localStorage.getItem('uid'), //用户id
            services: [], // 服务
            totalMoney: 0, //总支付钱
            totalYmoney: 0, // 总需要易豆数
            method: [], //检测店铺的服务方式是否存在到店方式
            joinYgoods: [], //是否参加易货，1参加易货，0不参加既不让用易豆支付
            joinFlag: false,
        }
    },
    components: {
        Popup
    },
    mounted: function() {
        // this.attention() //获取是否关注了公众号
        this.getOrderInfo() // 获取订单详情
        this.getAddress() // 获取地址
    },
    filters: {
        formatMoney: function(value) {
            if (typeof value == "number") {
                return "￥" + value.toFixed(2);
            }
        }
    },
    methods: {

        goPay() { // 提交订单
            if (!this.addressList[0]) {
                this.$dialog.toast({ mes: '请填写地址', timeout: 2000 });
                return
            }

            // this.axios.put('/order/fill', {
            //     order_ids: this.$route.query.orderId,
            //     consignee: this.addressList[0].consignee,
            //     reap_mobile: this.addressList[0].reap_mobile,
            //     reap_province: this.addressList[0].reap_province,
            //     reap_city: this.addressList[0].reap_city,
            //     reap_county: this.addressList[0].reap_county,
            //     detail_address: this.addressList[0].detail_address,
            //     o_note: this.message,
            //     o_addr_id: this.addressList[0].id,
            // }).then(res => {
            //     if (res.data.result) {
            //         // this.$dialog.loading.open('加载中,请稍候~')
            //         window.location.href = '/shopCar/paymentDesk?orderId=' + this.$route.query.orderId
            //     } else {
            //         this.$dialog.toast({ mes: res.data.message });
            //     }
            // })

            this.axios.post('/wechatauth/donation/money', {
                openid: localStorage.getItem('openid'),
                orders: this.$route.query.orderId,
            }).then(res => {
                console.log(res)
                this.wechatInfo = res.data.datas.signArray
                this.ordersn = res.data.datas.ordersn
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(), false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', this.jsApiCall());
                        document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall());
                    }
                    return
                } else { // 唤起微信支付
                    this.jsApiCall();
                }
            })
        },
        jsApiCall: function() {
            console.log('this.wechatInfo', this.wechatInfo)
            let that = this
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                    "appId": this.wechatInfo.appId,
                    "timeStamp": this.wechatInfo.timeStamp,
                    "nonceStr": this.wechatInfo.nonceStr,
                    "package": this.wechatInfo.package,
                    "signType": this.wechatInfo.signType,
                    "paySign": this.wechatInfo.paySign
                },
                function(res) {
                    WeixinJSBridge.log(res.err_msg);
                    if (res.err_msg == "get_brand_wcpay_request:ok") { //如果微信支付成功

                        this.axios.post('/wechatauth/donation/confirm', {
                                params: {
                                    ordersn: this.ordersn
                                }
                            }).then(result => {
                                if (result.data.result) {
                                    this.$dialog.toast({ mes: '支付成功！', timeout: 3000 });
                                    this.$router.push('/member/center')
                                } else {
                                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                }
                            })
                            // window.location.href="/shopCar/writeOff?orderId=" + that.orderId
                            // this.$router.push('/activity/list')

                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        this.$dialog.toast({ mes: '支付取消o(╥﹏╥)o', timeout: 3000 });
                    }
                }
            );
        },
        getOrderInfo() { // 获取订单详情
            this.orderId = this.$route.query.orderId.split(',')
            this.orderId.forEach((value, index) => {
                // this.axios.get('/order/info', {
                //     params: {
                //         id: value
                //     }
                // }).then(res => {
                // this.orderDatas.push(res.data.datas)
                this.orderDatas = [{
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
                        order_goods: [{
                            goods: {
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
                                hidden_price: 0,
                                id: 453,
                                is_join_yigoods: 1,
                                off_shelve: 1,
                                updated_at: "2018-04-01 16:08:33"
                            },
                            id: 1033,
                            iscomment: 0,
                            og_count: 8,
                            og_gid: 453,
                            og_oid: 1384,
                            og_price: "29.90",
                            og_routine_beans: "0.10",
                            og_routine_fee: "0.10",
                            og_style_id: "",
                            og_yprice: 30
                        }, ],
                        updated_at: "2018-03-22 14:33:15"
                    },
                    consignee: null,
                    created_at: "2018-04-23 15:58:49",
                    detail_address: null,
                    id: 1384,
                    o_addr_id: null,
                    o_bid: 172,
                    o_complaints: null,
                    o_freight: "0.00",
                    o_gids: null,
                    o_iscomment: 0,
                    o_note: null,
                    o_ordernum: "152447032946647",
                    o_pay_balance: "0.00",
                    o_pay_beans: 0,
                    o_pay_way: null,
                    o_pay_wechat: "0.00",
                    o_price: "239.20",
                    o_real_beans: 0,
                    o_real_poundage: "0.00",
                    o_receivemsg: 0,
                    o_routine_beans: 24,
                    o_routine_fee: "24.00",
                    o_service: 0,
                    o_status: 0,
                    o_uid: 124,
                    o_yprice: 240,
                    o_yratio: "1.000",
                    reap_city: null,
                    reap_county: null,
                    reap_mobile: null,
                    reap_province: null,
                    updated_at: "2018-04-23 15:58:49"
                }]
                var money = 0
                var yMoney = 0
                var freight = 0 // 运费
                var yradio = 0 // 比例
                this.orderDatas.forEach(value => { // 拿商品的规格
                    money += parseFloat(value.o_price)
                    yMoney += parseFloat(value.o_yprice)
                    freight = value.o_freight
                    yradio = value.o_yratio
                        // value.business.order_goods.forEach(val => {
                        //     this.method.push(val.goods.g_isknock)
                        //     this.joinYgoods.push(val.is_join_yigoods)

                    // })
                })

                // let index = this.joinYgoods.indexOf(0)
                // if (index >= 0) {
                //     this.joinFlag = true
                // }

                this.totalMoney = parseFloat(parseFloat(money) + parseFloat(freight)).toFixed(2)
                this.totalYmoney = yMoney + Math.ceil(freight * yradio)
                    // })
            })
        },
        goSelectAddress() { // 选择地址
            this.$router.push('/my/selectAddress?orderId=' + this.$route.query.orderId)
        },
        getAddress() { // 获取地址
            if (this.$route.query.addressId) { // 检测到从选择地址页来的，就获取该地址详情
                this.axios.get('/address/info', {
                    params: {
                        id: this.$route.query.addressId
                    }
                }).then(res => {
                    this.addressList.push(res.data.datas)
                        // console.log('this.addressList', this.addressList)
                })
                return
            }
            // this.axios.get('/address/list', { // 获取默认地址
            //     params: {
            //         offset: 0,
            //         limit: 10,
            //         uid: this.uid
            //     }
            // }).then(res => {
            // console.log(res)
            // this.total = res.data.datas.total
            this.total = 1
            this.addressList = [{
                    consignee: "陈俊",
                    created_at: "2018-01-01 01:19:38",
                    detail_address: "庐山南大道348号南昌市农业科学院大厦1801室",
                    id: 103,
                    is_default: 1,
                    reap_city: "南昌市",
                    reap_county: "红谷滩新区",
                    reap_mobile: 18979108189,
                    reap_province: "江西",
                    uid: 124,
                    updated_at: "2018-01-01 01:19:38"
                }]
                // })
        }

    },
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid") }).then((res) => {
    //             if (res.data.result) {
    //                 vm.shareImgData = res.data.datas.share_img
    //                 vm.shareUrl = res.data.datas.share_url
    //             }
    //         });
    //     });
    // },
    // beforeCreate() {
    //     this.SDKRegister(this, () => {
    //         console.log('首页调用分享')
    //     })
    // },
}