import Vue from 'vue';
import WechatPlugin from "vux/src/plugins/wechat/index.js"
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import 'vue-ydui/dist/ydui.base.css'
Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)

export default {
    data() {
        return {
            article: {},
            shareImg: false,
            isCollect: false
        }
    },
    watch: {},
    mounted: function() {
        this.share();
        if (this.$route.query.id) {
            this.getDetail();
        } else {
            this.$router.go(-1)
        }
    },
    methods: {
        goMoreArticle() {
            this.$router.push('understand?id=1')
        },
        shareBtn() {
            this.shareImg = !this.shareImg;
        },
        toCollect(obj) {
            this.axios.post('/wechatauth/article/collect', {
                article_id: this.$route.query.id,
                article_type: 2
            }).then(result => {
                if (result.data.result) {
                    this.isCollect = !this.isCollect
                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                } else {
                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                }
            })
        },
        // 获取文章详情
        getDetail() {
            this.axios.get('/wechatauth/sport/news/detail', {
                params: {
                    id: this.$route.query.id
                }
            }).then(res => {
                console.log(res)
                if (res.data.result) {
                    this.article = res.data.datas
                    this.article.content = this.article.content.replace(/<img/g, '<img style="max-width:100%;height:auto" ') //防止富文本图片过大
                    this.article.content = this.article.content.replace(/<iframe/g, '<iframe style="max-width:100%;height:auto" ')
                    this.isCollect = res.data.datas.iscollect
                } else {
                    this.article = {}
                }
            })
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
                    var wxtitle = this.article.title // 标题
                    var wximg = 'http://znwapi.anasit.com/upload/shareimg.png'
                        // var wxlink = that.link
                    var wxdesc = this.article.abstract // 描述(分享给微信/QQ好友/微博时显示)
                    this.$wechat.onMenuShareAppMessage({ // 分享给朋友
                        title: wxtitle, // 分享标题
                        desc: wxdesc, // 分享描述
                        link: url,
                        imgUrl: wximg, // 分享图标
                        // 用户确认分享后执行的回调函数
                        success: function() {
                            that.axios.post('/wechatauth/benefit/share', { id: that.$route.query.id, type: 3 }).then(res => {
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
                            that.$dialog.toast({ mes: '取消分享！', timeout: 3000 });
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
                            that.axios.post('/wechatauth/benefit/share', { id: that.$route.query.id, type: 3 }).then(res => {
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
                            this.$dialog.toast({ mes: '取消分享到朋友圈', timeout: 3000 });
                        }
                    });
                })
            }, 1000);
        },
        beforeCreate() {
            this.SDKRegister(this, () => {

            })
        }
    }
}