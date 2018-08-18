import Vue from 'vue';


export default {
    data() {
        return {
            answer: 0,
            article: {},
            user_answer: ''
        }
    },
    watch: {},
    mounted: function() {
        this.getDaily()
    },
    methods: {
        toMonthly() {
            this.$router.push('/learn/monthly')
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
            if (num === 1) {
                this.user_answer = 'a'
            } else if (num === 2) {
                this.user_answer = 'b'
            } else if (num === 3) {
                this.user_answer = 'c'
            } else if (num === 4) {
                this.user_answer = 'd'
            }
        },
        save() {
            // this.$router.push('/learn/answer?id=' + this.article.id + '&answer=' + this.user_answer)
            this.axios.post('/wechatauth/user/answer/question', {
                question_id: this.article.id,
                user_answer: this.user_answer
            }).then(result => {
                if (result.data.result) {
                    this.$router.push('/learn/answer')
                } else {
                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                }
            })
        },
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}