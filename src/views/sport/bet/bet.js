import Vue from 'vue';


export default {
    data() {
        return {
            collectList: [],
            selectvalue: 0,
            bet: '',
            optionId : 0
        }
    },
    watch: {},
    mounted: function() {
        this.betDetail();
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        changValue(el, option_id) {
            this.selectvalue = el
            this.optionId = option_id
        },
        timeDeformate(time) {
            if (time) {
                return time.split(" ")[0]
            }
        },
        // 确认竞猜
        confirmBet() {
            
            this.axios.post("/wechatauth/sport/guess/enlist", {
                    id: this.$route.query.id,
                    option_id:this.optionId
            }).then(res => {
                this.$dialog.toast({ mes: res.data.message, timeout: 3000 });
                console.log(this.bet)
            })
        },

        // 竞猜详情
        betDetail() {
            this.axios.get("/wechatauth/sport/guess/detail", {
                params: {
                    id: this.$route.query.id
                }
            }).then(res => {
                if (res.data.result) {
                    this.bet = res.data.datas;
                    this.optionId = this.bet.option[0].id
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 3000 });
                    
                }
                console.log(this.bet)
            })
        }


    }
}