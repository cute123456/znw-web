import Vue from 'vue';
import fixBottom from '@/components/fixBottom'
/* 使用px：import {Search} from 'vue-ydui/dist/lib.px/search'; */
import {
    ProgressBar
} from 'vue-ydui/dist/lib.rem/progressbar';
import { Selector } from 'vux'

/* 使用px：import {ProgressBar} from 'vue-ydui/dist/lib.px/progressbar'; */

Vue.component(ProgressBar.name, ProgressBar);
var publicKey = '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyfRmdYFS58Xrr3rVPbhv' +
    'ofOFbMmWEJlr1Lec7O5faCG0ACXIWQnqlUwJhdIuimNJhFjwuiYDYjJnQ3EOdGIk' +
    'YLRO12sdCefcqiKXF5+NIKW4NikgGdr2t2zi8RwA94Q5DO3g/+B+w3FP2QSwrnhW' +
    'wQ0R2++CrwPFW4txsyXIJQdi0Uv/2pG8vhrRHQrHa29bc/qDUYT4a4z99d6fSDUV' +
    'JtOrjBYPw76jjf5R1tGKgoCQs9YIM7d6EzNv4j3cbOJqU2kRhhgDyHhinB/c1dpi' +
    'JWXAjkJHRCyEU9Ugex1Mmi149B6Ucs2JN8PFm9vSoMDesSDtTOd9pQNwyeCIn0TP' +
    'wwIDAQAB' +
    '\n-----END PUBLIC KEY-----';
var divDom = document.getElementById('encryptContent');

function encryptParam() {
    var param = document.getElementById('paramInput').value;
    var crypt = new window.JSEncrypt();
    crypt.setKey(publicKey);
    divDom.innerHTML = crypt.encrypt(param.toString());
}
export default {
    components: {
        fixBottom,
        Selector
    },
    data() {
        return {
            type: 1,
            willShow: false,
            mobile: '',
            code: '',
            send: true,
            mes: '发送验证码',
            publicKey: '-----BEGIN PUBLIC KEY-----\n' +
                'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyfRmdYFS58Xrr3rVPbhv' +
                'ofOFbMmWEJlr1Lec7O5faCG0ACXIWQnqlUwJhdIuimNJhFjwuiYDYjJnQ3EOdGIk' +
                'YLRO12sdCefcqiKXF5+NIKW4NikgGdr2t2zi8RwA94Q5DO3g/+B+w3FP2QSwrnhW' +
                'wQ0R2++CrwPFW4txsyXIJQdi0Uv/2pG8vhrRHQrHa29bc/qDUYT4a4z99d6fSDUV' +
                'JtOrjBYPw76jjf5R1tGKgoCQs9YIM7d6EzNv4j3cbOJqU2kRhhgDyHhinB/c1dpi' +
                'JWXAjkJHRCyEU9Ugex1Mmi149B6Ucs2JN8PFm9vSoMDesSDtTOd9pQNwyeCIn0TP' +
                'wwIDAQAB' +
                '\n-----END PUBLIC KEY-----',
            schoolList: [],
            school: 0,
            name: ''
        }
    },
    mounted: function() {

        this.getSchoolList();

    },
    created: function() {

    },
    methods: {
        // 获取验证码
        getCode() {
            if (this.mobile === "") {
                this.$dialog.toast({
                    mes: '请输入要绑定的手机号',
                    timeout: 1500
                });
                return
            }
            if (!/^1[3|4|5|7|8]\d{9}$/gi.test(this.mobile)) {
                this.$dialog.toast({ mes: '请输入正确的手机号', timeout: 1500 });
                return
            }
            if (!this.send) {
                this.$dialog.toast({ mes: '请稍后', timeout: 1500 });
                return
            }
            var paramA = this.encryptParam(this.mobile)
            var paramB = this.encryptParam(new Date())
            this.axios.post('/wechatauth/user/mobile/code', {
                A: paramA,
                B: paramB
            }).then(res => {
                if (res.data.result) {
                    this.$dialog.toast({
                        mes: '发送成功',
                        timeout: 1500,
                        icon: 'success',
                        callback: () => {
                            let num = 60
                            this.mes = num + 's后发送'
                            this.send = false
                            const timer = setInterval(() => {
                                num--;
                                if (num <= 0) {
                                    this.mes = '重新发送'
                                    this.send = true
                                    clearInterval(timer)
                                } else {
                                    this.mes = num + 's后发送'
                                }
                            }, 1000)
                        }
                    });
                } else {
                    this.$dialog.toast({
                        mes: '发送失败，请稍后重试',
                        timeout: 1500,
                        icon: 'success'
                    });
                }
                console.log(res)
            })

        },

        // 参数加密
        encryptParam(param) {
            var crypt = new window.JSEncrypt();
            crypt.setKey(publicKey);
            return crypt.encrypt(param.toString());
        },

        //绑定手机号
        bindMobile() {
            if (!this.name.trim()) {
                this.name = this.name.trim();
                this.$dialog.toast({
                    mes: '请输入姓名',
                    timeout: 1500
                });
                return
            }
            if (this.mobile === "") {
                this.$dialog.toast({
                    mes: '请输入要绑定的手机号',
                    timeout: 1500
                });
                return
            }
            if (this.code === "") {
                this.$dialog.toast({
                    mes: '请输入短信验证码',
                    timeout: 1500
                });
                return
            }
            this.axios.post('/wechatauth/user/mobile/confirm', {
                mobile: this.mobile,
                code: this.code,
                realname: this.name,
                school_id: this.school
            }).then(res => {
                if (res.data.result) {
                    this.$dialog.toast({
                        mes: res.data.message,
                        timeout: 1500,
                        icon: 'success',
                        callback: () => {
                            this.$router.push(this.$route.query.path)
                        }
                    });
                } else {
                    this.$dialog.toast({
                        mes: res.data.message,
                        timeout: 1500,
                        icon: 'error'
                    });
                }
                console.log(res)
            })
        },
        getSchoolList() {
            this.axios.get('/wechatauth/school/list', {}).then(res => {
                console.log(res);
                if (res.data.result) {
                    this.schoolList = res.data.datas
                }
            })
        }
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}