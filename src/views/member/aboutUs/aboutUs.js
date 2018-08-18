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
            message: '会玩的人，改变世界!',
            phone: '客服电话：13607093057'

        }
    },
    mounted: function() {},
    methods: {

    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}