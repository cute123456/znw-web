import Vue from 'vue';


export default {
    data() {
        return {
            willShow: false,
            myCode: '',
            activityDetail: '',
            memberInfo: '',


        }
    },
    watch: {

    },
    mounted: function() {
        this.getMemberInfo()
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        //显示我的二维码
        showCode(bool) {
            this.willShow = bool
            if (bool) {
                this.axios.get('/wechatauth/user/qrcode/credit').then(res => {
                    this.myCode = res.data.datas
                })
            }
        },
        timeDeformate(time) {
            if (time) {
                return time.split(" ")[0]
            }
        },
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
            })
        },
    }
}