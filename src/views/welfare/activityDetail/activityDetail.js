import Vue from 'vue';
import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.component(ProgressBar.name, ProgressBar);

export default {
    data() {
        return {
            activityDetail: '',
            benefitactivity_id: 1,
            wechatInfo: ''
        }
    },
    mounted: function() {
        this.getActivityDetail();
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {

        // 获取公益详情
        getActivityDetail() {
            this.axios.get('/wechatauth/benefit/detail', {
                params: {
                    benefitactivity_id: this.$route.query.id
                }
            }).then(res => {

                this.activityDetail = res.data.datas
                this.activityDetail.progress = this.activityDetail.raisedMoney / this.activityDetail.targetAmount
                console.log(this.activityDetail)

            })
        },

        // 发起微信支付
        wxPay() {
            this.axios.post('/wechatauth/donation/money', {
                public_benefit_activity_id: this.$route.query.id,
                money: 0.01
            }).then(res => {
                console.log(res)
                this.wechatInfo = res.data.datas.signArray
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

                        // window.location.href="/shopCar/writeOff?orderId=" + that.orderId
                        // this.$router.push('/activity/list')

                    } else if (res.err_msg == "get_brand_wcpay_request:cancel") {

                    }
                }
            );
        },

    }

}