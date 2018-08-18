import Vue from 'vue';


export default {
    data() {
        return {
            willShow: false,
            myCode: '',
            activityDetail: '',
            memberInfo: '',
            medalLists: [],
            medalIcon: '',
            medalIsGain: false,
            medalName: '',
            medalConditions: '',

        }
    },
    watch: {

    },
    mounted: function() {
        this.getMemberInfo()
        this.getMedalList()
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        //显示我的二维码
        showCode(bool) {
            this.willShow = bool
            if (bool) {
                // this.axios.get('/wechatauth/user/qrcode/credit').then(res => {
                //     this.myCode = res.data.datas
                // })
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

        // 获取勋章列表
        getMedalList() {
            this.axios.get('/wechatauth/medal/list').then(res => {
                this.medalLists = res.data.datas
                console.log(this.medalLists)
            })
        },

        // 显示单个勋章
        showMedal(icon, name, conditions, isGain) {
            this.willShow = true
            this.medalIcon = icon
            this.medalIsGain = isGain
            this.medalName = name
            this.medalConditions = conditions
        }
    }
}