import Vue from 'vue';
import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar';
import fixBottom from '@/components/fixBottom'
import { InfiniteScroll } from 'vue-ydui/dist/lib.px/infinitescroll'
import { ListTheme, ListItem } from 'vue-ydui/dist/lib.px/list'
import Group from 'vux/src/components/group/index.vue'
import Radio from 'vux/src/components/radio/index.vue'
import 'vue-ydui/dist/ydui.base.css'
Vue.component(InfiniteScroll.name, InfiniteScroll)
Vue.component(ListTheme.name, ListTheme)
Vue.component(ListItem.name, ListItem)
Vue.component(ProgressBar.name, ProgressBar);
import { Accordion, AccordionItem } from 'vue-ydui/dist/lib.rem/accordion';
Vue.component(Accordion.name, Accordion);
Vue.component(AccordionItem.name, AccordionItem);

export default {
    components: {
        fixBottom,
        Radio,
        Group
    },
    data() {
        return {
            type: 1,
            welfareActivity: [],
            welfareActivitys: [],
            limit: 10,
            offset: 0,
            page: 2, // 滚动加载
            pageSize: 10,
            isDoInit: true,
            isChangType: false,
            options: [{
                key: '1',
                value: '进行中'
            }, {
                key: '0',
                value: '已结束'
            }],
            selectvalue: 1,
            isOpen: false
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
        change(event) {
            if (this.type === 0) {
                this.isOpen = false
                this.$refs.accordion.closeItem();
            } else if (this.type === 1) {
                this.isOpen = false
                this.$refs.accordiontwo.closeItem();
            }
            this.$nextTick(function() {
                console.log('selectvalue:', this.selectvalue)
                this.getInitItem();
                // console.log(this.$el.textContent) // => 'updated'
            })
        },
        timeDeformate(time) {
            return time.split(" ")[0]
        },
        changType(type) {
            console.log('换')
            if (type != this.type) {
                this.$refs.accordion.closeItem();
                this.$refs.accordiontwo.closeItem();
                this.selectvalue = 1
            }
            this.isOpen = !this.isOpen;
            if (type === 0) {
                if (this.isOpen) {
                    this.$refs.accordion.openItem();
                } else {
                    this.$refs.accordion.closeItem();
                }
            } else {
                if (this.isOpen) {
                    this.$refs.accordiontwo.openItem();
                } else {
                    this.$refs.accordiontwo.closeItem();
                }
            }
            this.welfareActivity = [];
            this.isDoInit = true;
            this.isChangType = true;
            this.page = 2;
            this.type = type;
            this.getInitItem();
            this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.reInit');
        },
        toPage: function(id, from) {
            window.location.href = '/welfare/itemDetail?id=' + id + '&fromtype=' + from
                // this.$router.push('/welfare/itemDetail?id=' + id + '&fromtype=' + from)
        },
        // 获取初始公益活动列表
        getInitItem() {
            this.welfareActivity = []
            this.axios.get('/wechatauth/benefit/search', {
                params: {
                    limit: this.limit,
                    offset: 0,
                    type: this.type,
                    status: this.selectvalue
                }
            }).then(res => {
                if (res.data.result) {
                    if (this.isDoInit || this.isChangType) {
                        if (this.type === 0) {
                            this.welfareActivity = res.data.datas.rows;
                            this.pageSize = res.data.datas.total
                        } else {
                            this.welfareActivitys = res.data.datas.rows;
                            this.pageSize = res.data.datas.total
                            this.welfareActivitys.forEach(el => {
                                el.progress = el.raisedMoney / el.targetAmount
                            });
                        }
                        this.isChangType = false;
                    } else {
                        return;
                    }
                } else {
                    this.welfareActivity = []
                    this.welfareActivitys = []
                    this.pageSize = 0
                }
            })


        },
        // 获取公益活动列表
        getWelfareItem() {
            this.isDoInit = false;
            this.axios.get('/wechatauth/benefit/search', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                    type: this.type,
                    status: this.selectvalue
                }
            }).then(res => {
                if (res.data.result) {
                    const _list = res.data.datas.rows;
                    if (this.type === 0) {
                        this.welfareActivity = [...this.welfareActivity, ..._list];
                    } else {
                        this.welfareActivitys = [...this.welfareActivitys, ..._list];
                        this.welfareActivitys.forEach(el => {
                            el.progress = el.raisedMoney / el.targetAmount
                        });
                    }
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
                    this.welfareActivitys = []
                }

            })
        }

        // 时间
    },
}