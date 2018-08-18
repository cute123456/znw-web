import Vue from 'vue';
import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar'
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import 'vue-ydui/dist/ydui.base.css'
Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)
Vue.component(ProgressBar.name, ProgressBar);

export default {
    data() {
        return {
            activityDetail: '',
            benefitactivity_id: 1,
            wechatInfo: '',
            isShowButton: true,
            from: "",
            isCollect: false,
            shareImg: false,
            memberInfo: {},
            fromRecord: false,
            tabNum: 3,
            commit: '',
            limit: 6,
            offset: 0,
            page: 1, // 滚动加载
            pageSize: 0,
            commitList: []
        }
    },
    mounted: function() {
        this.share()
        this.getActivityDetail();
        if (this.$route.query.fromtype === 'recordPage') {
            this.fromRecord = true
            this.isShowButton = false
        } else if (this.$route.query.fromtype === 'ActiverecordPage') {
            this.from = 'active'
            this.fromRecord = true
            this.isShowButton = false
        } else if (this.$route.query.fromtype === 'ProjectrecordPage') {
            this.from = 'project'
            this.fromRecord = true
            this.isShowButton = false
        } else if (this.$route.query.fromtype === 'active') {
            this.from = 'active'
            this.isShowButton = true
        } else if (this.$route.query.fromtype === 'project') {
            this.from = 'project'
            this.isShowButton = true
        }
    },
    methods: {
        toCommit() {
            if (this.commit === '') {
                this.$dialog.toast({ mes: '请想输入内容再评论', timeout: 2000 });
            } else {
                this.axios.post('/wechatauth/benefit/comment', {
                    activity_id: this.$route.query.id,
                    multiple_comment: 1,
                    comment: this.commit
                }).then(result => {
                    if (result.data.result) {
                        this.$dialog.toast({ mes: '发表评论成功，请等待管理员审核~', timeout: 3000 });
                    } else {
                        this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                    }
                })
            }
        },
        changeTab(num) {
            this.tabNum = num
            this.commitList = []
            this.page = 1
            if (num === 2) {
                this.getComit()
            }
        },
        getComit() {
            this.axios.get('/wechatauth/benefit/comment/list', {
                params: {
                    activity_id: this.$route.query.id,
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                }
            }).then(res => {
                const _list = res.data.datas.rows;
                this.commitList = [...this.commitList, ..._list];
                this.pageSize = res.data.datas.total
                if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                    /* 所有数据加载完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    return;
                }
                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.page++;
            })
        },
        //计算进度
        compute(a, b) {
            if (a && b && a != 0 && b != 0) {
                var num = a / b
                var res = num * 100
                return res.toFixed(2);
            } else {
                return 0;
            }

        },
        timeDeformate(time) {
            if (time) {
                return time.split(" ")[0]
            }
        },
        toCollect(obj) {
            this.axios.post('/wechatauth/benefit/collect', {
                benefitactivity_id: this.$route.query.id
            }).then(result => {
                if (result.data.result) {
                    obj.isCollect = !obj.isCollect
                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                } else {
                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                }
            })
        },
        // 获取公益详情
        getActivityDetail() {
            this.axios.get('/wechatauth/benefit/detail', {
                params: {
                    benefitactivity_id: this.$route.query.id
                }
            }).then(res => {
                this.activityDetail = res.data.datas
                this.activityDetail.details = this.activityDetail.details.replace(/<img/g, '<img style="max-width:100%;height:auto" ') //防止富文本图片过大
                this.activityDetail.details = this.activityDetail.details.replace(/<iframe/g, '<iframe style="max-width:100%;height:auto" ')
                this.activityDetail.progress = this.activityDetail.raisedMoney / this.activityDetail.targetAmount
                this.activityDetail = JSON.parse(JSON.stringify(this.activityDetail))
                if (this.activityDetail.activitySummary && this.activityDetail.activitySummary == '' || this.activityDetail.activitySummary == null || this.activityDetail.activitySummary == undefined) {
                    this.tabNum = 3
                }
                // console.log(this.activityDetail)
            })
        },
        // 获取用户信息
        getMemberInfo(enlistIntegral) {
            this.axios.get('/wechatauth/user/info').then(res => {
                if (res.data.result) {
                    this.memberInfo = res.data.datas
                    if (enlistIntegral > this.memberInfo.integral) {
                        this.$dialog.confirm({
                            title: '积分不足',
                            mes: '系统检测到您的积分不足以参加本次活动，是否去获得更多积分？',
                            opts: [{
                                    txt: '取消',
                                    color: false,
                                    callback: () => {
                                        // this.$router.push('signUp?id=' + this.$route.query.id)
                                    }
                                },
                                {
                                    txt: '确定',
                                    color: true,
                                    callback: () => {

                                        this.$router.push('/member/integral')
                                    }
                                }
                            ]
                        });
                    } else {
                        this.axios.get('/wechatauth/user/info').then(res => {
                            if (res !== undefined && res.data.result) {
                                if (!res.data.datas.mobile) {
                                    // 绑定手机号
                                    this.$router.push('/member/bind?path=/')
                                } else {
                                    this.$router.push('signUp?id=' + this.$route.query.id)
                                }
                            } else {
                                this.$router.push('signUp?id=' + this.$route.query.id)
                            }
                        })
                    }
                } else {
                    this.memberInfo = {}
                }
            })
        },
        toDonation() {

            this.axios.get('/wechatauth/user/info').then(res => {
                if (res !== undefined && res.data.result) {
                    if (!res.data.datas.mobile) {
                        // 绑定手机号
                        this.$router.push('/member/bind?path=/')
                    } else {
                        this.$router.push('donation?id=' + this.$route.query.id)
                    }
                } else {
                    this.$router.push('donation?id=' + this.$route.query.id)
                }
            })
        },
        toSignup() {


            this.getMemberInfo(this.activityDetail.enlistIntegral);
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

        // 分享
        share() {
            setTimeout(() => {
                Vue.use(WechatPlugin) //  微信
                let url = "http://znw.anasit.com" + this.$route.fullPath
                let that = this
                this.axios.get('/wechatauth/get/jsapiticket', {
                    params: {
                        url: url
                    }
                }).then(res => { // 获得签名配置
                    var Data = res.data.datas;
                    // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
                    this.$wechat.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: Data.appid, // 必填，公众号的唯一标识
                        timestamp: Data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: Data.digit, // 必填，生成签名的随机串
                        signature: Data.signature, // 必填，签名，见附录1
                        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    })
                })

                this.$wechat.ready(() => {
                    // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
                    // 则可以直接调用，不需要放在ready函数中。
                    // that.link = that.shareUrl
                    // console.log(that.link)
                    var wxtitle = this.activityDetail.title // 标题
                    var wximg = 'http://znwapi.anasit.com/upload/shareimg.png'
                        // var wxlink = that.link
                    var wxdesc = this.activityDetail.briefIntroduction // 描述(分享给微信/QQ好友/微博时显示)
                    this.$wechat.onMenuShareAppMessage({ // 分享给朋友
                        title: wxtitle, // 分享标题
                        desc: wxdesc, // 分享描述
                        link: url,
                        imgUrl: wximg, // 分享图标
                        // 用户确认分享后执行的回调函数
                        success: function() {
                            that.axios.post('/wechatauth/benefit/share', { id: that.$route.query.id, type: 1 }).then(res => {
                                console.log(res)
                                if (res.data.result) {
                                    that.$dialog.toast({ mes: '分享获得积分成功！', timeout: 3000 });
                                } else {
                                    that.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                }
                            })

                        },
                        // 用户取消分享后执行的回调函数
                        cancel: function() {
                            that.$dialog.toast({ mes: '分享取消！', timeout: 3000 });
                        }
                    });
                    //分享到朋友圈
                    this.$wechat.onMenuShareTimeline({
                        title: wxtitle, // 分享标题
                        desc: wxdesc, // 分享描述
                        link: url,
                        // link: that.link,   // 分享链接
                        imgUrl: wximg, // 分享图标
                        // 用户确认分享后执行的回调函数
                        success: function() {
                            that.axios.post('/wechatauth/benefit/share', { id: that.$route.query.id, type: 1 }).then(res => {
                                console.log(res)
                                if (res.data.result) {
                                    that.$dialog.toast({ mes: '分享获得积分成功！', timeout: 3000 });
                                } else {
                                    that.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                }
                            })
                        },
                        // 用户取消分享后执行的回调函数
                        cancel: function() {
                            this.$dialog.toast({ mes: '分享到朋友圈取消', timeout: 3000 });
                        }
                    });
                })
            }, 1000);


        },
        /**
         * 点击分享按钮
         */
        shareBtn() {
            this.shareImg = !this.shareImg;
        },


    },
    beforeCreate() {
        this.SDKRegister(this, () => {

        })
    }
}