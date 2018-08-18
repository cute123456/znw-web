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
            featuredlist: [],
            limit: 10,
            page: 1, // 滚动加载
            pageSize: 10,
            description: '',
            subtitle: '',
            moduleName: "",
            detailImg: ''
        }
    },
    watch: {},
    mounted: function() {
        if (this.$route.query.id) {
            this.getMeduleDetail();
            this.getList();
        } else {
            this.$router.go(-1)
        }
    },
    methods: {
        // 获取模块列表
        getMeduleDetail() {
            this.axios.get('/wechatauth/study/module/detail', {
                params: {
                    id: this.$route.query.id
                }
            }).then(res => {
                console.log(res)
                if (res.data.result) {
                    let modules = res.data.datas
                    this.moduleName = modules.moduleName
                    console.log(this.moduleName)
                    this.subtitle = modules.subtitle
                    this.description = modules.description
                    this.detailImg = modules.detailImg
                } else {
                    // this.modules = []
                }
            })
        },
        toDetail(id) {
            this.$router.push('/learn/articledetail?id=' + id)
        },
        timeDeformate(time) {
            if (time) {
                return time.split(" ")[0]
            }
        },
        // 获取收藏列表
        getList() {
            this.axios.get('/wechatauth/study/article/list', {
                params: {
                    module_id: this.$route.query.id,
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