import Vue from 'vue';
import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar'
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import 'vue-ydui/dist/ydui.base.css'
Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)
Vue.component(ProgressBar.name, ProgressBar);

export default {
    data() {
        return {
            willShow: false,
            myCode: '',
            integralLog: [],
            limit: 20,
            offset: 0,
            page: 1, // 滚动加载
            pageSize: 20,
        }
    },
    watch: {},
    mounted: function() {
        this.getIntegralLog()
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
        // 获取积分明细
        getIntegralLog() {
            this.axios.get('/wechatauth/integral/log', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                }
            }).then(res => {
                const _list = res.data.datas.rows;
                this.integralLog = [...this.integralLog, ..._list];
                this.pageSize = res.data.datas.total
                if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                    /* 所有数据加载完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    return;
                }
                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.page++;
                // this.integralLog = res.data.datas.rows
                // console.log(this.integralLog)
            })
        }

    }
}