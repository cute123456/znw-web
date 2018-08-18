/*
 * @Author: veggieg8 
 * @Date: 2018-04-14 11:16:57 
 * 积分币兑换
 * @Last Modified by: veggieg8
 * @Last Modified time: 2018-05-22 16:51:05
 */

import Vue from 'vue';
import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar';
import fixBottom from '@/components/fixBottom'

Vue.component(ProgressBar.name, ProgressBar);

export default {
    components: {
        fixBottom
    },
    data() {
        return {
            quentity: null,
            donate: Number,
            total: 0,
            nickname: '',
            thumb: '',
            type: 0,
            memberInfo: {},
            ckbcount: null,
            ckbtotal: 0
        }
    },
    watch: {
        quentity: {
            handler(val, oldVal) {
                this.quentity = parseInt(this.quentity)
                if (!this.quentity || this.quentity === '') {
                    this.quentity = 0
                    this.total = 0
                } else if (this.quentity <= 0) {
                    this.quentity = 0
                    this.total = 0
                } else {
                    this.total = this.quentity * 100
                }
            },
            deep: true
        },
        donate: {
            handler(val, oldVal) {
                this.donate = parseInt(this.donate)
                if (!this.donate || this.donate === '') {
                    this.donate = 0
                } else if (this.donate <= 0) {
                    this.donate = 0
                } else {}
            },
            deep: true
        },
        ckbcount: {
            handler(val, oldVal) {
                this.ckbcount = parseInt(this.ckbcount)
                if (!this.ckbcount || this.ckbcount === '') {
                    this.ckbcount = 0
                    this.ckbtotal = 0
                } else if (this.ckbcount <= 0) {
                    this.ckbcount = 0
                    this.ckbtotal = 0
                } else {
                    this.ckbtotal = this.ckbcount * 100
                }
            },
            deep: true
        },
    },
    mounted: function() {
        if (this.$route.query.nick) {
            this.nickname = this.$route.query.nick
        }
        if (this.$route.query.thumb) {
            this.thumb = this.$route.query.thumb
        }
        this.getMemberInfo()
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        // 获取用户信息
        getMemberInfo() {
            console.log(localStorage.uid)
            this.axios.get('/wechatauth/user/info').then(res => {
                this.memberInfo = res.data.datas
                if (this.memberInfo.isManager === 0) {
                    this.$dialog.toast({ mes: '您无权进行此操作，请联系管理员！', timeout: 3000 });
                    this.$router.push('/')
                }
            })
        },
        changType(type) {
            this.type = type;
        },
        toExchange: function() {
            if (!this.quentity || this.quentity === 0) {
                this.$dialog.toast({ mes: '数量不能为0哦~', timeout: 3000 });
                return;
            } else {
                this.$dialog.confirm({
                    title: '提示操作',
                    mes: '您确定要兑换么？',
                    opts: [{
                            txt: '取消',
                            color: false,
                            callback: () => {
                                this.$dialog.toast({ mes: '已取消操作', timeout: 1000 });
                            }
                        },
                        {
                            txt: '确定',
                            color: true,
                            callback: () => {
                                this.axios.get('/wechatauth/integral/confirm', {
                                    params: {
                                        uid: this.$route.query.u,
                                        integral: this.total
                                    }
                                }).then(result => {
                                    if (result.data.result) {
                                        this.$dialog.toast({ mes: '兑换成功！', timeout: 3000 });
                                    } else {
                                        this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                    }
                                })
                            }
                        }
                    ]
                });

            }
        },
        toChangeBack: function() {
            if (!this.ckbcount || this.ckbcount === 0) {
                this.$dialog.toast({ mes: '数量不能为0哦~', timeout: 3000 });
                return;
            } else {
                this.$dialog.confirm({
                    title: '提示操作',
                    mes: '您确定要兑换么？',
                    opts: [{
                            txt: '取消',
                            color: false,
                            callback: () => {
                                this.$dialog.toast({ mes: '已取消操作', timeout: 1000 });
                            }
                        },
                        {
                            txt: '确定',
                            color: true,
                            callback: () => {
                                this.axios.post('/wechatauth/user/integral/exchange', {
                                    uid: this.$route.query.u,
                                    integral: this.ckbtotal
                                }).then(result => {
                                    if (result.data.result) {
                                        this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                    } else {
                                        this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                    }
                                })
                            }
                        }
                    ]
                });

            }
        },
        toDonate: function() {
            if (this.donate === 0) {
                this.$dialog.toast({ mes: '数量不能为0哦~', timeout: 3000 });
                return;
            } else {
                this.axios.post('/wechatauth/user/integral/send', {
                    uid: this.$route.query.u,
                    integral: this.donate
                }).then(result => {
                    if (result.data.result) {
                        this.$dialog.toast({ mes: '赠送成功！', timeout: 3000 });
                    } else {
                        this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                    }
                })
            }
        },
        HSrc: function(value) {
            let http = value.indexOf('http');
            if (http > -1) {
                return value
            } else {
                return this.HTTP + value
            }
        }
    }
}