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
            formFiles: {},
            infoList: [],
            memberInfo: '',
            haveCheck: [],
            status: true,
            CollectNum: 0
        }

    },
    mounted: function() {

        this.getMemberInfo();
        this.getCollectNum();
        this.checkIsSignin();


    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        fileChange: function(e) {
            this.$dialog.loading.open('图片上传中');
            var fileSize = 0;
            let _file = e.target.files[0];
            let _name = e.target.name;

            fileSize = _file.size
            if (fileSize > 8 * 1024 * 1024) {
                this.$dialog.toast({ mes: '文件不能大于8M' });
                e.target.value = '';
                return
            }
            this.formFiles[_name] = _file;

            // 获取图片路径
            let formData = new FormData();
            formData.append('avatar', this.formFiles[_name]);

            this.axios.post('/wechatauth/user/avatar', formData).then(res => {
                this.$dialog.loading.close();
                this.memberInfo.headimgurl = res.data.datas
            })

            e.target.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
        },
        getCollectNum() {
            this.axios.get('/wechatauth/benefit/collect/count').then(res => {
                if (res.data.result) {
                    this.CollectNum = res.data.datas.num
                } else {
                    this.CollectNum = 0
                }
            })

        },
        checkIsSignin() {
            this.axios.get('/wechatauth/signlog/week').then(res => {
                if (res.data.result) {
                    this.haveCheck = res.data.datas
                    var Nowdate = new Date();
                    var currentdate = Nowdate.getDate();
                    if (currentdate >= 0 && currentdate <= 9) {
                        currentdate = "0" + currentdate;
                    }
                    this.haveCheck.every(element => {
                        if (Number(element.createdAt.split(" ")[0].substring(8, 10)) === Number(currentdate)) {
                            this.status = false
                            return false;
                        } else {
                            this.status = true
                            return true;
                        }
                    });
                } else {
                    this.haveCheck = []
                    this.status = true
                }
            })
        },
        toPage: function(e) {
            if (e === 'none') {
                this.toMind()
            } else {
                this.$router.push(e)
            }
        },
        toInvited() {
            window.location.href = "/member/qrcode";
        },
        // 获取用户信息
        getMemberInfo() {
            console.log(localStorage.uid)
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