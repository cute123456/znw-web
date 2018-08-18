import Vue from 'vue';
import fixBottom from '@/components/fixBottom'

export default {
    components: {
        fixBottom
    },
    data() {
        return {
            willShow: false,
            extensionShow: true,
            myCode: '',
            infoList: [{
                    //  page: "/",
                    image: '/static/img/mum_top_10.png',
                    text: '待付款'
                }, {
                    //  page: "/",
                    image: '/static/img/mum_top_12.png',
                    text: '待发货'
                }, {
                    //  page: "/",
                    image: '/static/img/mum_top_14.png',
                    text: '待收货'
                }, {
                    //  page: "/",
                    image: '/static/img/mum_top_16.png',
                    text: '已完成'
                }

            ],

            lists: [{
                    page: "./sign",
                    image: '/static/img/mum_07.png',
                    text: '签到'
                },
                {
                    page: "./record",
                    image: '/static/img/mum_09.png',
                    text: '公益记录'
                },
                {
                    page: "none",
                    image: '/static/img/mum_11.png',
                    text: '成长记录'
                },
                {
                    page: "none",
                    image: '/static/img/mum_13.png',
                    text: '宝贝相册'
                },
                {
                    page: "./redeem",
                    image: '/static/img/mum_19.png',
                    text: '积分兑换'
                }, {
                    page: "./opinion",
                    image: '/static/img/mum_20.png',
                    text: '意见反馈'
                }, {
                    page: "./aboutUs",
                    image: '/static/img/mum_21.png',
                    text: '关于我们'
                }


            ],
            memberInfo: '',

        }

    },
    mounted: function() {

        this.getMemberInfo();


    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        toPage: function(e) {
            if (e === 'none') {
                this.toMind()
            } else {
                this.$router.push(e)
            }
        },
        // 获取用户信息
        getMemberInfo() {
            this.axios.get('/wechatauth/user/info').then(res => {
                this.memberInfo = res.data.datas
                console.log(this.memberInfo)
            })
        },
        HSrc: function(value) {
            let http = value.indexOf('http');
            if (http > -1) {
                return value
            } else {
                return this.HTTP + value
            }
        },
        // 获取我的二维码
        getMyCode() {
            this.axios.get('/wechatauth/user/qrcode/credit').then(res => {
                console.log(res)
            })
        },
        //显示我的二维码
        showCode(bool) {
            this.willShow = bool
            if (bool) {
                this.axios.get('/wechatauth/user/qrcode/credit').then(res => {
                    this.myCode = res.data.datas
                })
            }

        },
        toMind() {
            this.$dialog.toast({ mes: '功能暂未开放，请耐心等待~', timeout: 3000 });
        }

    }
}