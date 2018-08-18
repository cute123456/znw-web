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
            message: '',

        }
    },
    mounted: function() {},
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {

        changType(type) {
            this.type = type;
            console.log(this.type);
        },

        // 提交反馈
        suggest() {
            if (this.message === '') {
                this.$dialog.toast({
                    mes: '内容不能为空哦',
                    timeout: 1500
                });
            } else {
                this.axios.post('/wechatauth/feedback/insert', {
                    content: this.message
                }).then(res => {
                    if (res.data.result) {

                        this.$dialog.toast({
                            mes: res.data.message,
                            timeout: 1500,
                            icon: 'success',
                            callback: () => {
                                this.$router.push('/member')
                            }
                        });

                    } else {
                        this.$dialog.toast({
                            mes: '提交失败，请稍后重试',
                            timeout: 1500,
                            icon: 'error'
                        });
                    }
                })
            }
        }

    }
}