import Vue from 'vue';
import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.component(ProgressBar.name, ProgressBar);

export default {
    data() {
        return {
            isShowWelcom: false,
            activityDetail: '',
            benefitactivity_id: 1,
            wechatInfo: '',
            showActive: false,
            intro: [{
                    text: '清泉计划:',
                    value: '为旱灾地区捐水'
                },
                {
                    text: '筹资时间:',
                    value: '2018年03月24日至2018年05月13日'
                },
                {
                    text: '发起组织:',
                    value: '关爱地球协会'
                },
                {
                    text: '举办地址:',
                    value: '江西省南昌市艾溪湖公园'
                }
            ],
            //输入的捐赠金额
            money: '',
            //输入的可用积分
            available: '',
            moneyPay: {
                //总积分
                totalIntegral: 2500,
                //可抵扣金额
                canUseMoney: 0,
                //实际支付金额
                Payment: 0,
            },
            //返回的订单号
            ordersn: "",
            donationHint: ''
        }
    },
    watch: {
        available: {
            handler(val, oldVal) {
                // this.money = parseInt(this.money)
                this.available = parseInt(this.available)
                if (!this.available) {
                    this.available = 0
                    this.moneyPay.canUseMoney = 0
                } else if (this.available < 0 || this.available > this.moneyPay.totalIntegral) {
                    this.$dialog.toast({ mes: '输入的积分超过可用积分', timeout: 3000 });
                    this.available = 0
                    this.moneyPay.canUseMoney = 0
                } else {
                    this.moneyPay.canUseMoney = (this.available / 100)
                }
                if (this.money && this.money > 0) {
                    this.moneyPay.Payment = (this.moneyPay.canUseMoney + this.money)
                } else {
                    this.moneyPay.Payment = this.moneyPay.canUseMoney
                }
            },
            deep: true
        },
        money: {
            handler(val, oldVal) {
                if (this.money > 0) {
                    this.money = (parseInt(this.money * 100) / 100)
                    this.moneyPay.Payment = (this.moneyPay.canUseMoney + this.money)
                } else if (this.money == 0) {
                    // this.money = this.money
                    this.moneyPay.Payment = this.moneyPay.canUseMoney
                } else {
                    this.money = 0
                    this.moneyPay.Payment = this.moneyPay.canUseMoney
                }

                // this.money = parseInt(this.money)
                // this.moneyPay.Payment = (this.moneyPay.canUseMoney + this.money)
            },
            deep: true
        },
    },
    mounted: function() {
        this.getActivityDetail();
        console.log(this.showActive + "QQQ")
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        close() {
            this.isShowWelcom = false
            this.$router.push('/member/record')
        },
        timeDeformate(time) {
            if (time) {
                return time.split(" ")[0]
            }
        },
        // 获取公益详情
        getActivityDetail() {
            this.axios.get('/wechatauth/benefit/detail', {
                params: {
                    benefitactivity_id: this.$route.query.id
                }
            }).then(res => {

                this.activityDetail = res.data.datas
                    // this.activityDetail.progress = this.activityDetail.raisedMoney / this.activityDetail.targetAmount
                console.log(this.activityDetail.donationHint)

            })
        },
        //捐赠积分接口
        donationPoints() {
            this.axios.post('/wechatauth/donation/integral', {
                public_benefit_activity_id: this.$route.query.id,
                integral: this.available
            }).then(req => {
                if (req.data.result) {
                    this.$dialog.toast({ mes: '积分捐赠成功！', timeout: 1000 });
                    console.log(this.money)
                    if (!this.money || this.money <= 0) {
                        this.isShowWelcom = true
                    }
                } else {
                    this.$dialog.toast({ mes: req.data.message, timeout: 3000 });
                }
            })
        },
        //捐赠金额
        donationMoney() {
            this.axios.post('/wechatauth/donation/money', {
                public_benefit_activity_id: this.$route.query.id,
                money: this.money
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
        // 发起微信支付
        wxPay() {
            if ((this.available && this.available > 0) || (this.money && this.money > 0)) {
                if (this.available && this.available > 0) {
                    this.donationPoints();
                }
                if (this.money && this.money > 0) {
                    this.donationMoney();
                }
            } else {
                this.$dialog.toast({ mes: '请输入捐赠金额或积分~', timeout: 3000 });
                return;
            }
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

                        that.axios.post('/wechatauth/donation/confirm', {
                                ordersn: that.ordersn
                            }).then(result => {
                                if (result.data.result) {
                                    that.$dialog.toast({ mes: '支付成功！', timeout: 3000 });
                                    // that.$router.push('/member/record')
                                    this.isShowWelcom = true
                                } else {
                                    that.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                }
                            })
                            // window.location.href="/shopCar/writeOff?orderId=" + that.orderId
                            // this.$router.push('/activity/list')

                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        that.$dialog.toast({ mes: '支付取消o(╥﹏╥)o', timeout: 3000 });
                    }
                }
            );
        },

    }
}