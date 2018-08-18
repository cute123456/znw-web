import Vue from 'vue';


export default {
    data() {
        return {
            answer: 0,
            article: {},
            user_answer: '',
            minute: 0,
            second: 0,
            time: 1800,
            isShowSuccess: false
        }
    },
    watch: {},
    beforeDestroy(to, form, next) {
        this.getTiming(0);
        next();
    },
    created() {
        this.getTiming(1);
    },
    mounted: function() {
        this.getDaily()
    },
    methods: {
        getTiming(stop) {
            // var time = 1800; //30分钟换算成1800秒
            var that = this;
            const timer = setInterval(function() {
                that.time--;
                if (that.time <= 0) {
                    console.log('结束')
                    this.$dialog.toast({
                        mes: '时间到！提交中~',
                        timeout: 3000
                    });
                    clearInterval(timer)
                } else {
                    if (stop == 0) {
                        console.log('结束2')
                        window.clearInterval(timer)
                        return;
                    } else {
                        that.minute = parseInt(that.time / 60);
                        that.second = parseInt(that.time % 60);
                        // console.log(this.minute)
                        // console.log(that.second)
                    }
                }
            }, 1000);
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
                    this.$dialog.toast({
                        mes: result.data.message,
                        timeout: 3000
                    });
                }
            })
        },
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}