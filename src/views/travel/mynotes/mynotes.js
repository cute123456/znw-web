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
            memberInfo: {},
            notes: [],
            limit: 20,
            offset: 0,
            page: 1, // 滚动加载
            pageSize: 10,
            isShowImg: false,
            Img: '',
            isLess: false,
        }
    },
    watch: {},
    mounted: function() {
        this.getMemberInfo();
        this.getNotes();
    },
    methods: {
        getMonthDay(str, i) {
            if (str.split("-")[i] > 9) {
                return str.split("-")[i]
            } else {
                return str.split("-")[i].split("")[1]
            }
        },
        getLength(arr) {
            if (arr === null) {
                return 0
            } else {
                return arr.length
            }
        },
        // 获取我发布的游记圈内容
        getNotes() {
            this.axios.get('/wechatauth/travel/note/list/mine', {
                params: {
                    limit: this.limit,
                    offset: (this.page - 1) * this.limit,
                }
            }).then(res => {
                if (res.data.result) {
                    const _list = res.data.datas.rows;
                    this.notes = [...this.notes, ..._list];
                    // console.log('changdu', this.notes[0].noteImages.length)
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
                    this.notes = []
                }
            })
        },
        //删除游记
        toDelete(obj, arr) {
            this.$dialog.confirm({
                title: '提示操作',
                mes: '您确定要删除游记么？',
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
                            this.axios.delete('/wechatauth/travel/note/delete', {
                                params: {
                                    id: obj.id
                                }
                            }).then(result => {
                                if (result.data.result) {
                                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                    // this.arr.foreach((el, i) => {
                                    //     if (el.id === obj.id) {
                                    //         this.arr.splice(i, 1)
                                    //     }
                                    // })
                                    this.notes = [];
                                    this.page = 1;
                                    this.getNotes();
                                } else {
                                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                                }
                            })
                        }
                    }
                ]
            });
        },
        closeImg() {
            this.isShowImg = false
            this.Img = ''
        },
        showImg(url) {
            var gWinHeight = document.body.clientHeight; //获取屏幕高度
            var gWinWidth = document.body.clientWidth; //获取屏幕宽度
            var activeimg = new Image()
                // activeimg.src = 'http://znwapi.anasit.com/upload/277981fc50a06659599b2a894eab78b8.jpg'
            activeimg.src = 'http://znwapi.anasit.com/' + url
            var naturalW = activeimg.naturalWidth;
            var naturalH = activeimg.naturalHeight;
            var e = naturalW / gWinWidth
            var chazhi = (gWinHeight - naturalH) / 2
            console.log('比例', e)
            console.log('naturalW宽', naturalW)
            console.log('naturalH高', naturalH)
            console.log('chazhi', chazhi)
            this.Img = 'http://znwapi.anasit.com/' + url
            if (naturalH * e < gWinHeight) { //如果图片高度小于屏幕高度
                console.log(1111111111111)
                console.log('chazhi', chazhi)
                document.getElementById('largeImg').style.marginTop = chazhi;
                // document.getElementById('img-div').style.paddingTop = chazhi;
                this.isLess = true
                    // document.getElementById('largeImg').style.transform = 'translate(0,-50%)';
            }
            this.isShowImg = true
        },
        // 获取用户信息
        getMemberInfo() {
            this.axios.get('/wechatauth/user/info').then(res => {
                if (res.data.result) {
                    this.memberInfo = res.data.datas
                } else {
                    this.memberInfo = {}
                }
            })
        },
        toRelease() {
            this.$router.push('/travel/release')
        },
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}