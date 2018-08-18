import Vue from 'vue';
import Loading from 'vux/src/components/loading/index.vue'
export default {
    data() {
        return {
            code: '',
            nick: '樟脑玩联盟',
            uid: 0,
            isShow: true,
            memberInfo: {}
        }

    },
    components: {
        Loading,
    },
    methods: {

        share() {
            setTimeout(() => {
                Vue.use(WechatPlugin) //  微信
                let url = "http://znw.anasit.com?u=" + this.uid
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
                    var wxtitle = "您的好友邀请您加入樟脑玩联盟" // 标题
                    var wximg = 'http://znwapi.anasit.com/upload/shareimg.png'
                        // var wxlink = that.link
                    var wxdesc = "会玩的人，改变世界" // 描述(分享给微信/QQ好友/微博时显示)
                    this.$wechat.onMenuShareAppMessage({ // 分享给朋友
                        title: wxtitle, // 分享标题
                        desc: wxdesc, // 分享描述
                        link: url,
                        imgUrl: wximg, // 分享图标
                        // 用户确认分享后执行的回调函数
                        success: function() {
                            that.$dialog.toast({ mes: '分享好友成功！', timeout: 3000 });
                        },
                        // 用户取消分享后执行的回调函数
                        cancel: function() {
                            that.$dialog.toast({ mes: '取消分享到好友！', timeout: 3000 });
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
                            that.$dialog.toast({ mes: '分享朋友圈成功！', timeout: 3000 });
                        },
                        // 用户取消分享后执行的回调函数
                        cancel: function() {
                            this.$dialog.toast({ mes: '取消分享到朋友圈', timeout: 3000 });
                        }
                    });
                })
            }, 1000);
        },

        // 初始化画布
        initCanvas() {
            var canvas = document.createElement('canvas');
            return canvas;
        },

        // 载入背景图
        loadBackground(canvas, nick, callback) {
            var bgImage = new Image();
            bgImage.src = '/static/img/source3.png';
            bgImage.crossOrigin = 'Anonymous';
            bgImage.onload = function() {
                var ctx = canvas.getContext('2d');
                canvas.width = bgImage.naturalWidth;
                canvas.height = bgImage.naturalHeight;
                ctx.drawImage(bgImage, 0, 0);
                ctx.fillStyle = '#000'
                ctx.font = '32px 宋体';
                ctx.fillText(nick, 350, 720);
                callback(canvas);
            }
        },

        // 载入二维码
        loadQrcode(canvas, callback) {
            var qrcodeImage = new Image();
            qrcodeImage.crossOrigin = 'Anonymous';
            qrcodeImage.src = this.code;
            qrcodeImage.onload = function() {
                var ctx = canvas.getContext('2d');
                ctx.drawImage(qrcodeImage, 271, 455, 207, 207);
                callback(canvas);
            };
        },

        showQrcode(canvas) {
            document.getElementById('qrcode').src = canvas.toDataURL("image/jpg");
        },

        // 载入头像
        loadAvatar(canvas, callback) {
            let http = this.memberInfo.headimgurl.indexOf('http');
            var avatarImg = '';
            if (http > -1) {
                avatarImg = Vue.prototype.HTTP + 'wechatauth/user/head/img?headImg=' + this.memberInfo.headimgurl
            } else {
                avatarImg = Vue.prototype.HTTP + 'wechatauth/user/head/img?headImg=http://znwapi.anasit.com' + this.memberInfo.headimgurl
            }
            var avatar = new Image();
            console.log(avatar.src);
            avatar.crossOrigin = 'Anonymous';
            avatar.src = avatarImg;
            avatar.onload = function() {
                var ctx = canvas.getContext('2d');
                // var pattern = ctx.createPattern(avatar, "no-repeat");
                // ctx.arc(50, 100, 50, 0, 2 * Math.PI);
                // ctx.fillStyle = pattern;
                // ctx.moveTo(200, 200);
                // ctx.fill();
                ctx.beginPath();
                ctx.arc(200, 320, 50, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(avatar, 150, 270, 100, 100);
                callback(canvas);
            };

        },

        // 获取推广二维码

        getCode() {

            this.axios.get('/wechatauth/user/qrcode').then(res => {
                if (res.data.result) {
                    this.code = res.data.datas
                        // 获取用户信息
                    this.axios.get('/wechatauth/user/info').then(res => {
                        if (res.data.result) {
                            this.nick = res.data.datas.nickname
                            this.uid = res.data.datas.id
                            var canvas = this.initCanvas();
                            this.loadBackground(canvas, this.nick, canvas => {
                                this.loadQrcode(canvas, (canvas) => {
                                    // this.loadAvatar(canvas, (canvas) => {
                                    this.showQrcode(canvas);
                                    // })
                                });
                            });
                        }
                    })
                    this.isShow = false
                }

            })
        },

        // 获取用户信息
        getMemberInfo() {
            this.axios.get('/wechatauth/user/info').then(res => {
                this.memberInfo = res.data.datas;
            })
        },

    },
    mounted: function() {
        this.share();
        this.getMemberInfo();

        this.$nextTick(function() {
            this.getCode();
        });


    },
    beforeRouteEnter(to, from, next) {
        // Indicator.open();
        next(vm => {
            vm.axios.get("/wechatauth/user/info").then((res) => {
                vm.shareUrl = "http://znw.anasit.com?u=" + res.data.datas.id
            });
        });
    },
    beforeCreate() {
        this.SDKRegister(this, () => {

        })
    },
}