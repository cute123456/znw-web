// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'
// import MintUI from 'mint-ui'
import 'vue-resource'
import App from './App'
import store from './store'
import router from './router'
import gobal from './global.js'
import iconSvg from '@/components/iconSvg'
import VueLazyload from 'vue-lazyload'
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.use(gobal)
Vue.use(VueLazyload)
Vue.use(VueAxios, axios)
Vue.component('icon-svg', iconSvg) // fontIcon 若在阿里图标中添加了新图标,请在index.html中更新代码
Vue.config.productionTip = false

// Vue.use(MintUI)

Vue.prototype.$dialog = {
    confirm: Confirm,
    alert: Alert,
    toast: Toast,
    notify: Notify,
    loading: Loading,
}

// 正式版
Vue.prototype.HTTP = 'http://znwapi.anasit.com/';
axios.defaults.baseURL = 'http://znwapi.anasit.com/';

// 测试版
// axios.defaults.baseURL = 'http://localhost';
// Vue.prototype.HTTP = 'http://localhost';
// axios.defaults.baseURL = 'http://192.168.1.105/';
// Vue.prototype.HTTP = 'http://192.168.1.105/';

Vue.prototype.imgUrl = 'http://znwapi.anasit.com/';


// 用户信息
Vue.prototype.memberInfo = '';
Vue.prototype.SDKRegister = (that, callback) => {
    setTimeout(() => {
        Vue.use(WechatPlugin) //  微信
        let url = window.location.href
        that.axios.get('/wechatauth/get/jsapiticket', {
            params: {
                url: url
            }
        }).then(res => { // 获得签名配置
            var Data = res.data.datas;
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
            that.$wechat.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: Data.appid, // 必填，公众号的唯一标识
                timestamp: Data.timestamp, // 必填，生成签名的时间戳
                nonceStr: Data.digit, // 必填，生成签名的随机串
                signature: Data.signature, // 必填，签名，见附录1
                jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
        })

        that.$wechat.ready(() => {
            // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，
            // 则可以直接调用，不需要放在ready函数中。
            var link = that.shareUrl
                // console.log(that.link)
            var wxtitle = '您的好友邀您加入樟脑玩！' // 标题
            var wximg = 'http://znwapi.anasit.com/upload/shareimg.png'
                // var wxlink = that.link
            var wxdesc = '会玩的人，改变世界！' // 描述(分享给微信/QQ好友/微博时显示)
            that.$wechat.onMenuShareAppMessage({ // 分享给朋友
                title: wxtitle, // 分享标题
                desc: wxdesc, // 分享描述
                link: link,
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
                link: link,
                // link: that.link,   // 分享链接
                imgUrl: wximg, // 分享图标
                // 用户确认分享后执行的回调函数
                success: function() {
                    Toast({
                        mes: "分享到朋友圈成功",
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
    }, 1000);

};

router.beforeEach((to, from, next) => {
    // this.SDKRegister(this, () => {
    //     console.log(11111111111111)
    // })
    if (process.env.NODE_ENV == 'development') { //开发环境
        // 设置测试账号
        localStorage.uid = 5
        localStorage.token = '9490fc67085e9d0b2b428103d54898310e659865'
        next();
    } else {
        if (!localStorage.uid && !localStorage.token) {
            if (to.query.code !== undefined && to.query.state !== undefined) {
                axios.get('/wechatauth/auth/token', {
                    params: {
                        code: to.query.code,
                        state: to.query.state
                    }
                }).then(res => {
                    localStorage.uid = res.data.datas.id
                    localStorage.token = res.data.datas.token
                    next()

                })

            } else {
                var url = 'http://znw.anasit.com' + to.fullPath

                axios.get('/wechatauth/auth/url', {
                    params: {
                        url: url
                    }
                }).then(res => {
                    window.location.href = res.data.datas
                })
            }

        } else {
            next()
        }


    }





})

router.afterEach((to, from) => {
    console.log(from)
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    }
})