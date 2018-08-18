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
            featuredlist: [],
            limit: 10,
            offset: 0,
            page: 2, // 滚动加载
            pageSize: 10,
            type: 0,
            isDoInit: true,
            isChangType: false,
        }
    },
    watch: {},
    mounted: function() {
        this.getInit();
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        changType(type) {
            this.collectList = [];
            this.featuredlist = [];
            this.isDoInit = true;
            this.isChangType = true;
            this.page = 2;
            this.type = type;
            this.getInit();
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
        },
        toDetail(id) {
            this.$router.push('/welfare/itemDetail?id=' + id + '&fromtype=active')
        },
        toArticleDetail(item) {
            if (item.articleType === 1) {
                this.$router.push('/learn/articledetail?id=' + item.article.id)
            } else {
                this.$router.push('/sport/detail?id=' + item.article.id)
            }
        },
        timeDeformate(time) {
            if (time) {
                return time.split(" ")[0]
            }
        },
        Uncollect(obj) {
            this.$dialog.confirm({
                title: '提示操作',
                mes: '您确定要取消对' + obj.activity.title + '的收藏么？',
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
                                benefitactivity_id: obj.benefitId
                            }).then(result => {
                                if (result.data.result) {
                                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                    this.collectList.forEach((el, i) => {
                                        if (el.benefitId === obj.benefitId) {
                                            this.collectList.splice(i, 1)
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
        UncollectArticle(obj) {
            this.$dialog.confirm({
                title: '提示操作',
                mes: '您确定要取消对' + obj.article.title + '的收藏么？',
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
                            this.axios.post('/wechatauth/article/collect', {
                                article_id: obj.articleId,
                                article_type: obj.articleType
                            }).then(result => {
                                if (result.data.result) {
                                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                    this.featuredlist.forEach((el, i) => {
                                        if (el.articleId === obj.articleId) {
                                            this.featuredlist.splice(i, 1)
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
        // 获取初始活动收藏列表
        getInit() {
            this.collectList = []
            this.featuredlist = []
            if (this.type === 0) {
                this.axios.get('/wechatauth/benefit/collect/list', {
                    params: {
                        limit: this.limit,
                        offset: 0,
                    }
                }).then(res => {
                    if (res.data.result) {
                        if (this.isDoInit || this.isChangType) {
                            this.collectList = res.data.datas.rows;
                            this.pageSize = res.data.datas.total
                            this.isChangType = false;
                        } else {
                            return;
                        }
                    } else {
                        this.collectList = []
                        this.pageSize = 0
                    }
                })
            } else {
                this.axios.get('/wechatauth/article/collect/list', {
                    params: {
                        limit: this.limit,
                        offset: 0,
                    }
                }).then(res => {
                    if (res.data.result) {
                        if (this.isDoInit || this.isChangType) {
                            this.featuredlist = res.data.datas.rows;
                            this.pageSize = res.data.datas.total
                            this.isChangType = false;
                        } else {
                            return;
                        }

                    } else {
                        this.featuredlist = []
                        this.pageSize = 0
                    }
                })
            }

        },
        // 获取收藏列表
        getCollectList() {
            this.isDoInit = false;
            this.axios.get('/wechatauth/benefit/collect/list', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                }
            }).then(res => {
                if (res.data.result) {
                    const _listone = res.data.datas.rows;
                    this.collectList = [...this.collectList, ..._listone];
                    this.pageSize = res.data.datas.total
                    if (_listone.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
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
        // 获取文章收藏列表
        getList() {
            this.isDoInit = false;
            this.axios.get('/wechatauth/article/collect/list', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                }
            }).then(res => {
                if (res.data) {
                    const _list = res.data.datas.rows;
                    this.featuredlist = [...this.featuredlist, ..._list];
                    this.pageSize = res.data.datas.total
                    if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                        /* 所有数据加载完毕 */
                        this.$refs.infinitescrollDemos.$emit('ydui.infinitescroll.loadedDone');
                        return;
                    }
                    /* 单次请求数据完毕 */
                    this.$refs.infinitescrollDemos.$emit('ydui.infinitescroll.finishLoad');
                    this.page++;
                } else {
                    this.featuredlist = []
                }
            })
        },


    }
}