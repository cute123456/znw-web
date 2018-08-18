import Vue from 'vue';
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import 'vue-ydui/dist/ydui.base.css'
Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)

export default {
    data() {
        return {
            limit: 10,
            page: 1, // 滚动加载
            pageSize: 10,
            schoollist: []
        }
    },
    watch: {},
    mounted: function() {
        this.getList();
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        // 获取获排名列表
        getList() {
            this.axios.get('/wechatauth/integral/school/donate/rank', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                }
            }).then(res => {
                if (res.data) {
                    const _list = res.data.datas.rows;
                    this.schoollist = [...this.schoollist, ..._list];
                    this.pageSize = res.data.datas.total
                    if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                        /* 所有数据加载完毕 */
                        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                        return;
                    }
                    /* 单次请求数据完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                    this.page++;
                } else {
                    this.schoollist = []
                }
            })
        },
    }
}