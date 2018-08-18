import Vue from 'vue';
import fixBottom from '@/components/fixBottom'
/* 使用px：import {Search} from 'vue-ydui/dist/lib.px/search'; */
import {
    ProgressBar
} from 'vue-ydui/dist/lib.rem/progressbar';
/* 使用px：import {ProgressBar} from 'vue-ydui/dist/lib.px/progressbar'; */

Vue.component(ProgressBar.name, ProgressBar);
export default {
    components: {
        fixBottom
    },
    data() {
        return {
            memberInfo: '',
            formFiles: {},
            isShowname: false,
            inputName: '',
            schoolList: [],
            school: 0,
            address: {

            }
        }
    },
    methods: {
        fileChange: function (e) {
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
        checkLength(obj) {
            if (obj.length > 0) {
                console.log(obj)
                return true;
            } else {
                return false;
            }
        },
        changeSchool() {
            // if (this.memberInfo.realname === null) {
            //     this.memberInfo.realname = ''
            // }
            // this.axios.post('/wechatauth/user/info/edit', {
            //     school_id: this.school,
            //     realname: this.memberInfo.realname
            // }).then(result => {
            //     if (result.data.result) {
            //         this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
            //     } else {
            //         this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
            //     }
            // })
        },
        // 获取学校列表
        getSchool() {
            this.axios.get('/wechatauth/school/list').then(res => {
                if (res.data.result) {
                    this.schoolList = res.data.datas
                } else {
                    this.schoolList = []
                }
            })
        },
        // 获取用户所在学校
        getUserSchool() {
            this.axios.get('/wechatauth/user/school').then(res => {
                if (res.data.result) {
                    if (res.data.datas) {
                        this.school = res.data.datas.id
                    } else {
                        this.school = 0
                    }
                } else {
                    this.school = 0
                }
            })
        },
        // 获取用户默认的收货地址
        getAddressDefault() {
            this.axios.get('/wechatauth/user/address/default').then(res => {
                if (res.data.result) {
                    this.address = res.data.datas
                } else {
                    this.address = {}
                }
            })
        },
        toChangename(name) {
            this.isShowname = true;
        },
        saveChange() {
            if (this.memberInfo.nickname === null || this.memberInfo.nickname.replace(/\s/g, "") === '') {
                this.$dialog.toast({ mes: '未填写有效昵称，不能保存哦~', timeout: 2000 });
                return;
            }
            if (this.memberInfo.realname === null || this.memberInfo.realname.replace(/\s/g, "") === '') {
                this.$dialog.toast({ mes: '未填写有效姓名，不能保存哦~', timeout: 2000 });
                return;
            }
            if (this.memberInfo.mobile === null || this.memberInfo.mobile.replace(/\s/g, "") === '') {
                this.$dialog.toast({ mes: '未填写有效手机号，不能保存哦~', timeout: 2000 });
                return;
            }
            this.axios.post('/wechatauth/user/info/edit', {
                school_id: this.school,
                realname: this.memberInfo.realname,
                nickname: this.memberInfo.nickname,
                mobile: this.memberInfo.mobile
            }).then(result => {
                if (result.data.result) {
                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                    // this.isShowname = false;
                } else {
                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                    // this.isShowname = true;
                }
            })
        },
        toPage: function (e) {
            if (e === 'none') {
                this.toMind()
            } else {
                this.$router.push(e)
            }
        },
        // 获取用户信息
        getMemberInfo() {
            this.axios.get('/wechatauth/user/info').then(res => {
                if (res.data.result) {
                    this.memberInfo = res.data.datas
                } else {
                    this.memberInfo = {}
                }
                // console.log(this.memberInfo)
            })
        },
        HSrc: function (value) {
            let http = value.indexOf('http');
            if (http > -1) {
                return value
            } else {
                return this.HTTP + value
            }
        },
    },
    mounted: function () {

        this.getMemberInfo();
        this.getSchool();
        this.getUserSchool();
        this.getAddressDefault();


    },
    beforeCreate() {
        this.SDKRegister(this, () => {
            console.log('首页调用分享')
        })
    }
}