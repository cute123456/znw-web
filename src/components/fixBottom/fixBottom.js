import Vue from 'vue'

export default {
    // name: 'fixBottom',
    props: {
        check: 0,
    },
    methods: {
        // goClassify(){
        //     if (sessionStorage.getItem('classId')) {
        //         sessionStorage.removeItem('classId')
        //     }
        //     this.$router.push('/classifyDetail/classify?id=1')
        // },
        // getUser() { // 获取用户信息
        //     this.axios.get('/user/info', {
        //         params: {
        //             openid: localStorage.getItem('openid')
        //         }
        //     }).then(res => {
        //         if (res.data.result) {
        //             this.user = res.data.datas;
        //         }
        //     })
        // },
        // change() { //点击我要易货
        //     if (this.user.is_business == 1) {
        //         this.$router.push('/barter/list')
        //     } else {
        //         this.$router.push('/my/merchant')
        //     }
        // }
    },
    created() {
        // this.getUser()
    }
}
