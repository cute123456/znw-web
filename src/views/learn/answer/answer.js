import Vue from 'vue';


export default {
    data() {
        return {
            answer: 0,
            article: {},
            question_id: 0,
            user_answer: '',
            userAnswer: {}
        }
    },
    watch: {},
    mounted: function() {
        this.getDaily();
        this.getAnswer();
    },
    methods: {
        toMonthly() {
            this.$router.push('/learn/monthly')
        },
        // 获取答题情况
        getAnswer() {
            this.axios.get('/wechatauth/today/answer/result').then(res => {
                if (res.data.result) {
                    this.userAnswer = res.data.datas
                } else {
                    this.userAnswer = {}
                }
            })
        },
        // 获取每日一题
        getDaily() {
            this.axios.get('/wechatauth/question/get/one').then(res => {
                if (res.data.result) {
                    this.article = res.data.datas
                } else {
                    this.article = {}
                }
            })
        },
        toLearn() {
            this.$router.push('/learn/learn')
        },
        changeAnswer(num) {
            this.answer = num
        },
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}