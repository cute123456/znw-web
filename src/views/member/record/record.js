import Vue from 'vue';
import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar';
import fixBottom from '@/components/fixBottom'
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll';
import { ListTheme, ListItem, ListOther } from 'vue-ydui/dist/lib.px/list';

Vue.component(ProgressBar.name, ProgressBar);
Vue.component(InfiniteScroll.name, InfiniteScroll);
Vue.component(ListTheme.name, ListTheme);
Vue.component(ListItem.name, ListItem);
Vue.component(ListOther.name, ListOther);

export default {
    components: {
        fixBottom
    },
    data() {
        return {
            type: 0,
            welfareActivity: '',
            limit: 10,
            offset: 0,
            record: [{
                value: '您已经做了30次公益，请继续您的善行'
            }],
            // 课程名称列表
            list: [],
            lists: [],
            isShowActive: false,
            isShowProject: false,
            isRepeat: true,
            listOne: [],
            listTwo: [],
        }
    },
    mounted: function() {
        this.getTab();

        this.getActivityList();

        // this.getWelfareItem();

    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {

        changType(type) {
            // this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
            if (this.type === type) {
                this.isRepeat = true;
            } else {
                this.isRepeat = false;
            }
            this.type = type;
            this.list = [];
            this.lists = [];
            this.listOne = [];
            this.listTwo = [];
            this.offset = 0;
            // this.getList();
            // // this.getWelfareItem()
            // console.log(this.type);
            if (this.type === 0) {
                this.getActivityList()
            } else if (this.type === 1) {
                this.getDonationList()
            }
        },

        getTab() {
            if (this.$route.path === '/commonweal') {
                this.show = 'false';
                console.log(111)
            }
        },
        toPage: function(id) {
            if (this.type === 0) {
                this.$router.push('/welfare/itemDetail?id=' + id + '&fromtype=ActiverecordPage')
            } else if (this.type === 1) {
                this.$router.push('/welfare/itemDetail?id=' + id + '&fromtype=ProjectrecordPage')
            } else {
                this.$router.push('/welfare/itemDetail?id=' + id + '&fromtype=recordPage')
            }
        },
        // 获取公益活动列表
        // getWelfareItem() {
        //     this.axios.get('/wechatauth/benefit/search', {
        //         params: {
        //             limit: this.limit,
        //             offset: this.offset,
        //             type: this.type
        //         }
        //     }).then(res => {
        //         if (res.data.result) {
        //             if (this.type === 0) {
        //                 this.list = this.list.concat(res.data.datas.rows);
        //                 if (this.list.length > 0) {
        //                     this.isShowActive = false
        //                 } else {
        //                     this.isShowActive = true
        //                 }
        //             } else {
        //                 this.lists = this.lists.concat(res.data.datas.rows);
        //                 if (this.lists.length > 0) {
        //                     this.isShowProject = false
        //                 } else {
        //                     this.isShowProject = true
        //                 }
        //             }
        //         }
        //     })
        // },
        // 初始化列表
        getActivityList() {
            this.offset = 0;
            this.axios.get('/wechatauth/benefit/log', {
                params: {
                    limit: this.limit,
                    offset: this.offset,
                }
            }).then(res => {
                if (res.data.result) {
                    this.listOne = res.data.datas.rows;
                    if (this.listOne.length > 0) {
                        this.isShowActive = false
                    } else {
                        this.isShowActive = true
                    }

                    if (res.data.datas.rows.length < this.limit) {
                        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    }
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                }
            })
        },
        getDonationList() {
            this.offset = 0;
            this.axios.get('/wechatauth/donation/search', {
                params: {
                    limit: this.limit,
                    offset: this.offset,
                }
            }).then(res => {
                if (res.data.result) {

                    this.listTwo = res.data.datas.rows;
                    console.log(this.listTwo)
                    if (this.listTwo.length > 0) {
                        this.isShowProject = false
                    } else {
                        this.isShowProject = true
                    }

                    if (res.data.datas.rows.length < this.limit) {
                        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    }
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                }
            })
        },

        // 加载更多
        loadMore() {
            this.offset = this.limit + this.offset;
            this.axios.get('/wechatauth/benefit/search', {
                params: {
                    limit: this.limit,
                    offset: this.offset,
                    type: this.type
                }
            }).then(res => {
                if (res.data.result) {
                    if (this.type === 0) {
                        this.listOne = this.listOne.concat(res.data.datas.rows);
                        if (this.listOne.length > 0) {
                            this.isShowActive = false
                        } else {
                            this.isShowActive = true
                        }
                    } else {
                        this.listTwo = this.listTwo.concat(res.data.datas.rows);
                        if (this.listTwo.length > 0) {
                            this.isShowProject = false
                        } else {
                            this.isShowProject = true
                        }
                    }
                    if (res.data.datas.rows.length < this.limit) {
                        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                    }
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                }
            })
        }

        // 时间

    }
}