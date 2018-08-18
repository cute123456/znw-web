import Vue from 'vue';
import Rater from 'vux/src/components/rater/index.vue';
import Loading from 'vux/src/components/loading/index.vue';
import WechatPlugin from 'vux/src/plugins/wechat/index.js';
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import 'vue-ydui/dist/ydui.base.css'

Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)

export default {
    components: {
        Rater,
        Loading
    },
    data() {
        return {
            activeTitle: 0, // 排序方式，0 默认，1销量， 2最新
            message: '', // 搜索内容
            searchList: [{
                admin_off_shelve: 0,
                created_at: "2017-12-31 21:09:20",
                g_bid: 76,
                g_class_id: 16,
                g_count: 10000,
                g_daygroom: 0,
                g_description: '<p><br></p><p>位置：江西省南昌市红谷滩新区闽江路凤凰假日广场营销中心旁，预计电话：0791-86796868</p><p><img class="fr - dib " style="width: 300 px;" src="http: //api.qumengkeji.com/upload/goods/b231ee35290cfe82b0991c1b0aba74ee.jpg"></p>',
                g_freight: 0,
                g_input_farclass: null,
                g_input_kidclass: null,
                g_isapproval: 1,
                g_isexpress: 0,
                g_isgroom: 1,
                g_isknock: 1,
                g_isoffline: 0,
                g_isyishop: 0,
                g_name: "红谷滩好汉聚酒店",
                g_pic: "http://apitest.qumengkeji.com/upload/b4374873a0db57ffceffb266c01a3ef7.jpg",
                g_pics: "http://apitest.qumengkeji.com/upload/04d7b3c8a5e7903f25e2468ffc816891.jpg,upload/7f4131e9bc6e3b8003540acfb0dbc026.jpg",
                g_price: "0.00",
                g_routine_beans: "0.10",
                g_routine_fee: "0.10",
                g_sales: 1,
                g_sales_add: 981,
                g_total: 100000,
                g_yend_time: "2018-12-31",
                g_yprice: 0,
                g_yratio: "1.000",
                g_ystar_time: "2018-01-01",
                hidden_price: 1,
                id: 73,
                is_join_yigoods: 1,
                off_shelve: 1,
                updated_at: "2018-04-22 21:20:09"
            }], // 搜索列表
            classId: '', //二级分类id
            g_isyishop: 0, // 
            g_isdaygroom: 0, //每日推荐
            rankNum: 0, //排序方式
            page: 1, // 滚动加载
            pageSize: 10,
            limit: 10,
        };
    },
    methods: {
        search() {
            // this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            this.$dialog.loading.open('拼命搜索中,请稍候~')
            this.page = 1
            this.searchList = []
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            setTimeout(() => {
                this.$dialog.loading.close()
                this.loadList()
            }, 300)
        },
        sort(method) {
            this.$dialog.loading.open()
            if (method == '销量') { // 4销量正序，2销量倒序
                if (this.rankNum == 4) {
                    this.rankNum = 2
                } else if (this.rankNum == 2) {
                    this.rankNum = 4
                } else {
                    this.rankNum = 4
                }
            } else if (method == '最新') { // 3时间正序，1时间倒序
                if (this.rankNum == 1) {
                    this.rankNum = 3
                } else if (this.rankNum == 3) {
                    this.rankNum = 1
                } else {
                    this.rankNum = 1
                }
            } else {
                this.rankNum = 0 // 按默认方式排序
            }
            this.searchList = []
            this.loadList()
        },
        loadList() { // 滚动加载
            this.axios.get("/citygoods/list", {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                    g_name: this.message,
                    g_class_id: this.classId,
                    g_isyishop: this.g_isyishop,
                    g_daygroom: this.g_isdaygroom,
                    rank: this.rankNum
                }
            }).then(res => {
                this.$dialog.loading.close()

                // let _list = res.data.datas.rows;
                // this.pageSize = res.data.datas.count
                let _list = [];
                this.searchList = [...this.searchList, ..._list];
                if (_list.length >= this.pageSize || this.page >= Math.ceil(this.pageSize / this.limit)) {
                    /* 所有数据加载完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    return;
                }

                /* 单次请求数据完毕 */
                this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                this.page++;
            });
        }
    },
    created() {
        this.g_isyishop = this.$route.query.g_isyishop
        this.g_isdaygroom = this.$route.query.g_isdaygroom // 获取每日推荐
        if (this.$route.query.searchCon) {
            this.message = this.$route.query.searchCon
        }

        if (this.$route.query.type) {
            this.classId = this.$route.query.id
        }
        this.loadList()

    },
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid") }).then((res) => {
    //             if (res.data.result) {
    //                 vm.shareImgData = res.data.datas.share_img
    //                 vm.shareUrl = res.data.datas.share_url
    //             }
    //         });
    //     });
    // },
    // beforeCreate() {
    //     this.SDKRegister(this, () => {
    //         console.log('首页调用分享')
    //     })
    // },
};