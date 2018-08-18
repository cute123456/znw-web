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
            modules: [],
            featuredlist: [],
            limit: 10,
            page: 1, // 滚动加载
            pageSize: 10,
            userAnswer: {}
        }
    },
    watch: {},
    mounted: function() {

        this.getMedule();
        this.getList();
    },
    methods: {
        // 获取答题情况
        getAnswer() {
            this.axios.get('/wechatauth/today/answer/result').then(res => {
                if (res.data.result) {
                    this.userAnswer = res.data.datas
                    if (this.userAnswer.isAnswer) {
                        this.$router.push('/learn/answer')
                    } else {
                        this.$router.push('/learn/daily')
                    }
                } else {
                    this.userAnswer = {}
                }
            })
        },
        toEveryDay() {
            // this.$router.push('/learn/daily')
            this.getAnswer()
        },
        // 获取模块列表
        getMedule() {
            this.axios.get('/wechatauth/study/module/list').then(res => {
                if (res.data) {
                    this.modules = res.data
                } else {
                    this.modules = []
                }
            })
        },
        //获取每日一学
        getDaily() {
            this.axios.get('/wechatauth/study/daily/article').then(res => {
                if (res.data.result) {
                    // this.modules = res.data
                    this.toDetail(res.data.datas.id);
                } else {
                    this.$dialog.toast({ mes: res.data.message, timeout: 3000 });
                }
            })
        },
        toUnderstand(obj) {
            if (obj.module_name === '每日一学') {
                this.getDaily();
            } else {
                this.$router.push('/learn/understand?id=' + obj.id)
            }
        },
        toDetail(id) {
            this.$router.push('/learn/articledetail?id=' + id)
        },
        timeDeformate(time) {
            if (time) {
                return time.split(" ")[0]
            }
        },
        // 获取获取精选文章列表
        getList() {
            this.axios.get('/wechatauth/study/article/recommend/list', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                }
            }).then(res => {
                if (res.data) {
                    const _list = res.data.rows;
                    this.featuredlist = [...this.featuredlist, ..._list];
                    this.pageSize = res.data.total
                    if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                        /* 所有数据加载完毕 */
                        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                        return;
                    }
                    /* 单次请求数据完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                    this.page++;
                } else {
                    this.featuredlist = []
                }
            })
        },
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}