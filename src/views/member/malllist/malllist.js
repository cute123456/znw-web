/*
 * @Author: veggieg8 
 * @Date: 2018-05-02 14:40:12 
 * @Last Modified by: veggieg8
 * @Last Modified time: 2018-05-17 16:17:46
 */

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
            collectList: [],
            limit: 10,
            offset: 0,
            page: 1, // 滚动加载
            pageSize: 10,
        }
    },
    watch: {},
    mounted: function() {
        this.getCollectList();
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        timeDeformate(time) {
            if (time) {
                return time.split(" ")[0]
            }
        },
        toExchange(obj) {
            this.$router.push('/member/confirm?id=' + obj.id)
        },
        // 获取商品列表
        getCollectList() {
            this.axios.get('/wechatauth/integral/goods/search', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                }
            }).then(res => {
                if (res.data.result) {
                    const _list = res.data.datas.rows;
                    this.collectList = [...this.collectList, ..._list];
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
                    this.collectList = []
                }
            })
        },


    }
}