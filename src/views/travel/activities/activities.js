import Vue from 'vue';
import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar';
import fixBottom from '@/components/fixBottom'
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'

import 'vue-ydui/dist/ydui.base.css'
Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)
Vue.component(ProgressBar.name, ProgressBar);


export default {
    components: {
        fixBottom,
    },
    data() {
        return {
            type: 1,
            welfareActivity: [],
            limit: 10,
            offset: 0,
            page: 2, // 滚动加载
            pageSize: 10,
            isDoInit: true,
            isChangType: false,
        }
    },
    mounted: function() {
        if (Number(this.$route.query.selectTab) === 0) {
            this.type = 0;
            this.getInitItem();
        } else if (Number(this.$route.query.selectTab) === 1) {
            this.type = 1;
            this.getInitItem();
        } else {
            this.getInitItem();
        }
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        countDay(time) {
            var s1 = new Date(time.replace(/-/g, "/"));
            var s2 = new Date(); //当前日期：2017-04-24
            var days = s1.getTime() - s2.getTime();
            var time = parseInt(days / (1000 * 60 * 60 * 24));
            return time;
        },
        targetDeformate(time) {
            return time.split(".")[0]
        },
        timeDeformate(time) {
            return time.split(" ")[0]
        },
        changType(type) {
            if (type != this.type) {
                console.log('换')
                this.isChangType = true;
            }
            this.welfareActivity = [];
            this.isDoInit = true;
            this.page = 2;
            this.type = type;
            this.getInitItem();
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
        },
        toPage: function(id, from) {
            window.location.href = '/travel/activityDetail?id=' + id + '&fromtype=' + from
                // this.$router.push('/welfare/itemDetail?id=' + id + '&fromtype=' + from)
        },
        // 获取初始公益活动列表
        getInitItem() {
            this.welfareActivity = []
            this.axios.get('/wechatauth/travel/activity/list', {
                params: {
                    limit: this.limit,
                    offset: 0,
                    is_active: this.type,
                    // status: this.selectvalue
                }
            }).then(res => {
                if (res.data.result) {
                    if (this.isDoInit || this.isChangType) {
                        this.welfareActivity = res.data.datas.rows;
                        this.pageSize = res.data.datas.total
                        this.isChangType = false;
                    } else {
                        return;
                    }
                } else {
                    this.welfareActivity = []
                    this.pageSize = 0
                }
            })


        },
        // 获取公益活动列表
        getWelfareItem() {
            this.isDoInit = false;
            this.axios.get('/wechatauth/travel/activity/list', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                    is_active: this.type,
                    // status: this.selectvalue
                }
            }).then(res => {
                if (res.data.result) {
                    const _list = res.data.datas.rows;
                    this.welfareActivity = [...this.welfareActivity, ..._list];

                    // this.welfareActivity = [...this.welfareActivity, ..._list];
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
                    this.welfareActivity = []
                }

            })
        }

        // 时间
    },
}