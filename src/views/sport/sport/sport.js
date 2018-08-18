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
            articlelist: []
        }
    },
    watch: {},
    mounted: function() {
        this.getArticleList();
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        // 获取文章列表
        getArticleList() {
            this.axios.get('/wechatauth/sport/news/list', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                    article_type: 1
                }
            }).then(res => {
                console.log(res)
                if (res.data) {
                    const _list = res.data.rows;
                    this.articlelist = [...this.articlelist, ..._list];
                    console.log(this.articlelist)
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
                    this.articlelist = []
                }
            })
        },
        toBet() {
            this.$router.push('/sport/bet')
        },
        toUnderstand(type) {
            this.$router.push('/learn/understand?type=' + type)
        },
        toDetail(id) {
            this.$router.push('/sport/detail?id=' + id)
        },
        timeDeformate(time) {
            if (time) {
                return time.split(" ")[0]
            }
        },
        Uncollect(obj) {
            this.$dialog.confirm({
                title: '提示操作',
                mes: '您确定要取消对' + obj.title + '的收藏么？',
                opts: [{
                        txt: '取消',
                        color: false,
                        callback: () => {
                            this.$dialog.toast({ mes: '已取消操作', timeout: 1000 });
                        }
                    },
                    {
                        txt: '确定',
                        color: true,
                        callback: () => {
                            this.axios.post('/wechatauth/benefit/collect', {
                                benefitactivity_id: obj.id
                            }).then(result => {
                                if (result.data.result) {
                                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                    this.collectList.forEach((el, i) => {
                                        if (el.id === obj.id) {
                                            this.collectList.splice(i, 1)
                                                //   return el
                                        }
                                    })
                                } else {
                                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                }
                            })
                        }
                    }
                ]
            });
        },
        // 获取收藏列表
        getCollectList() {
            // this.axios.get('/wechatauth/benefit/collect/list', {
            //     params: {
            //         limit: this.limit,
            //         offset: this.offset
            //     }
            // }).then(res => {
            //     if (res.data.result) {
            //         const _list = res.data.datas.rows;
            //         this.collectList = [...this.collectList, ..._list];
            //         this.pageSize = res.data.datas.total
            //         if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
            //             /* 所有数据加载完毕 */
            //             this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
            //             return;
            //         }
            //         /* 单次请求数据完毕 */
            //         this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
            //         this.page++;
            //     } else {
            //         this.collectList = []
            //     }
            // })
        },


    }
}