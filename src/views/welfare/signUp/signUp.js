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
            intro: [{
                    text: '活动计划:',
                    value: '和家人一起去野餐'
                },
                {
                    text: '活动时间:',
                    value: '2018年03月24日 下午 13:00'
                },
                {
                    text: '发起组织:',
                    value: '家融洽'
                },
                {
                    text: '举办地址:',
                    value: '江西省南昌市艾溪湖公园'
                },
                {
                    text: '活动费用:',
                    value: '免费'
                }
            ],
            applyInfo: {
                benefitactivity_id: this.$route.query.id,
                member_name: "",
                gender: "1",
                mobile: "",
                address: "",
                wechat: ''
            },
            memberInfo: {},
            codeimg: ''
        }
    },
    watch: {
        gender: {
            handler(val, oldVal) {
                console.log('性别', this.gender)
            },
            deep: true
        },
    },
    mounted: function() {
        this.getMyCode();
        this.getActivityDetail();
        this.getMemberInfo();
        // this.drow();
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        drow() {
            var gWinHeight = document.body.clientHeight; //获取屏幕高度
            var gWinWidth = document.body.clientWidth; //获取屏幕宽度
            var bgwidth = gWinWidth - 40
            var bgheight = gWinHeight * 0.71
            if (document.getElementById("myCanvas")) {
                var canvasList = document.getElementById('myCanvas');
                var canvas = document.createElement('canvas');
                canvasList.appendChild(canvas);
                if (gWinHeight >= 590) {
                    canvas.height = gWinHeight;
                } else {
                    canvas.height = 595
                }
                canvas.width = gWinWidth;
                canvas.style.backgroundColor = '#f09d35';
                canvas.style.overflowY = 'scroll';
                canvas.style.minHeight = gWinHeight;
                var ctx = canvas.getContext("2d");
                // ctx.fillStyle = "#f09d35";
                // ctx.fillRect(0, 0, gWinWidth, gWinHeight);
                // ctx.clearRect(0, 0, canvas.width, canvas.height);


                var bgElement = document.getElementById('bg-img'); //声明黄色背景图片
                var loveimg = document.getElementById('love-img') //声明爱心背景图片
                ctx.drawImage(bgElement, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(loveimg, 11, 11, gWinWidth - 22, 453);
                var activeimg = new Image()
                activeimg.setAttribute("crossOrigin", 'Anonymous')
                activeimg.src = 'http://znwapi.anasit.com/' + this.activityDetail.img
                console.log(' activeimg.src', activeimg.src)
                    // var activeimg = document.getElementById('active-img'); //声明活动图片
                    // var imgElement = document.getElementById('jspang-img'); //声明头像图片
                var logoElement = document.getElementById('logo-img'); //声明logo图片
                var codeElement = document.getElementById('code-img'); //声明二维码图片
                activeimg.onload = function() {
                    ctx.drawImage(activeimg, 21, 23, gWinWidth - 42, 167);
                }
                ctx.drawImage(logoElement, 74, 513, 131, 50);
                ctx.font = "12px PingFang-SC-Medium"; //间隔 30 ，35
                ctx.fillText("我是", 41, 215);
                ctx.font = "28px PingFang-SC-Medium";
                ctx.fillText(this.memberInfo.nickname, 41, 250);
                ctx.font = "12px PingFang-SC-Medium";
                ctx.fillText("我在", 41, 280);
                ctx.font = "28px PingFang-SC-Medium";
                ctx.fillText(this.activityDetail.address, 41, 315);
                ctx.font = "12px PingFang-SC-Medium";
                ctx.fillText("参加", 41, 345);
                // ctx.font = "16px PingFang-SC-Medium";
                // ctx.fillText("江西南昌青爱团队女童保护基金志愿者", 41, 365);
                /****绘制自动换行的字符串****/
                var t = this.activityDetail.title
                var chr = t.split("");
                var temp = "";
                var row = [];
                ctx.font = "16px PingFang-SC-Medium";
                ctx.fillStyle = "black";
                ctx.textBaseline = "middle";
                for (var a = 0; a < chr.length; a++) {
                    if (ctx.measureText(temp).width < (bgwidth - 42)) {;
                    } else {
                        row.push(temp);
                        temp = "";
                    }
                    temp += chr[a];
                }
                row.push(temp);
                for (var b = 0; b < row.length; b++) {
                    ctx.fillText(row[b], 41, 345 + (b + 1) * 20);
                }
                /****绘制自动换行的字符串--------结束****/
                ctx.font = "12px PingFang-SC-Medium";
                ctx.fillText("活动时间", 41, 400);
                ctx.font = "25px PingFang-SC-Medium";
                ctx.fillText(this.activityDetail.activityTime, 41, 430);
                var imgElement = new Image()
                imgElement.setAttribute("crossOrigin", 'Anonymous')
                imgElement.src = 'http://znwapi.anasit.com/' + this.memberInfo.headimgurl
                imgElement.onload = function() {
                        //画出圆形头像
                        // ctx.clearRect(gWinWidth - 90, 205, 50, 50);
                        ctx.save(); // 保存当前ctx的状态
                        ctx.beginPath();
                        ctx.arc(gWinWidth - 65, 230, 25, 0, Math.PI * 2, false); //画出圆
                        ctx.clip(); //裁剪上面的圆形
                        ctx.drawImage(imgElement, gWinWidth - 90, 205, 50, 50); // 在刚刚裁剪的园上画图
                        ctx.restore(); // 还原状态
                    }
                    // var codeElement = new Image()
                    // codeElement.setAttribute("crossOrigin", 'Anonymous')
                    // codeElement.src = this.codeimg
                    // codeElement.onload = function() {
                ctx.drawImage(codeElement, bgwidth * 0.7, 500, 90, 90); //添加二维码图片
                // }
                console.log(111)
                document.getElementById('qrcode').src = canvas.toDataURL("image/jpg");
                // document.getElementById('qrcode').style.backgroundColor = '#f09d35';
                canvas.style.display = 'none'
            }
        },
        // 获取我的二维码
        getMyCode() {
            this.axios.get('/wechatauth/user/qrcode').then(res => {
                console.log(res)
                if (res.data.result) {
                    this.codeimg = res.data.datas
                }
            })
        },
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
                console.log(this.activityDetail)
                setTimeout(() => {
                    this.drow();
                }, 500)

            })
        },
        //立即报名
        toApply() {
            if (this.applyInfo.member_name === "" || this.applyInfo.gender === "" || this.applyInfo.mobile === "" || this.applyInfo.address === "") {
                this.$dialog.toast({ mes: '请将您的信息填写完整~', timeout: 3000 });
                return;
            } else {
                if (this.activityDetail.enlistIntegral === 0) {
                    this.activityApply()
                } else {
                    this.$dialog.confirm({
                        title: '提示操作',
                        mes: '您确定要花费' + this.activityDetail.enlistIntegral + '积分报名该活动么？',
                        opts: [{
                                txt: '取消',
                                color: false,
                                callback: () => {
                                    this.$dialog.toast({ mes: '已取消报名', timeout: 1000 });
                                }
                            },
                            {
                                txt: '确定',
                                color: true,
                                callback: () => {
                                    this.activityApply()
                                }
                            }
                        ]
                    });
                }


            }
        },

        // 报名数据请求
        activityApply() {
            this.axios.get('/wechatauth/benefit/enlist', {
                params: {
                    benefitactivity_id: this.$route.query.id,
                    member_name: this.applyInfo.member_name,
                    gender: this.applyInfo.gender,
                    mobile: this.applyInfo.mobile,
                    address: this.applyInfo.address,
                    wechat: this.applyInfo.wechat
                }
            }).then(res => {
                console.log(res)
                if (res.data.result) {
                    this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
                    this.isShowWelcom = true
                    this.applyInfo = {
                        benefitactivity_id: this.$route.query.id,
                        member_name: "",
                        gender: "1",
                        mobile: "",
                        address: "",
                    }
                    this.drow();
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 3000 });
                }
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
        // 获取用户信息
        getMemberInfo() {
            this.axios.get('/wechatauth/user/info').then(res => {
                if (res.data.result) {
                    if (res.data.datas.realname) {
                        this.applyInfo.member_name = res.data.datas.realname;
                    } else {
                        this.applyInfo.member_name = "";
                    }
                    if (res.data.datas.sex) {
                        this.applyInfo.gender = res.data.datas.sex;
                    } else {
                        this.applyInfo.gender = 1;
                    }
                    if (res.data.datas.mobile) {
                        this.applyInfo.mobile = res.data.datas.mobile;
                    } else {
                        this.applyInfo.mobile = ""
                    }
                    if (res.data.datas.address) {
                        this.applyInfo.address = res.data.datas.address;
                    } else {
                        this.applyInfo.address = ""
                    }
                }
                console.log('applyInfo', this.applyInfo)
                this.memberInfo = res.data.datas
            })
        },

    }
}