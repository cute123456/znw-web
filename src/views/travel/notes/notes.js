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
            isShowInput: false,
            isShowImg: false,
            note_id: '',
            commit: '',
            Img: '',
            isLess: false,
            memberInfo: {},
            notes: [],
            limit: 10,
            offset: 0,
            page: 1, // 滚动加载
            pageSize: 10,
        }
    },
    watch: {},
    mounted: function() {
        this.getMemberInfo();
        this.getNotes();
    },
    methods: {
        getLength(arr) {
            if (arr === null) {
                return 0
            } else {
                return arr.length
            }
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
        // 获取游记圈内容
        getNotes() {
            this.axios.get('/wechatauth/travel/note/circle', {
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
        closeImg() {
            this.isShowImg = false
            this.Img = ''
            this.isLess = false
        },
        showImg(url) {
            var gWinHeight = document.body.clientHeight; //获取屏幕高度
            var gWinWidth = document.body.clientWidth; //获取屏幕宽度
            var activeimg = new Image()
                // activeimg.src = 'http://znwapi.anasit.com/upload/277981fc50a06659599b2a894eab78b8.jpg'
            activeimg.src = url
            var naturalW = activeimg.naturalWidth;
            var naturalH = activeimg.naturalHeight;
            var e = naturalW / gWinWidth
            var chazhi = (gWinHeight - naturalH) / 2
            console.log('比例', e)
            console.log('naturalW宽', naturalW)
            console.log('naturalH高', naturalH)
            this.Img = url
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
        showInput(id) {
            this.note_id = id
            this.isShowInput = true
        },
        sendMessage() {
            if (this.commit === '') {
                this.$dialog.toast({ mes: '请先输入评论！', timeout: 1500 });
                return;
            } else {
                this.axios.post('/wechatauth/travel/note/comment', {
                    note_id: this.note_id,
                    note_comment: this.commit
                }).then(result => {
                    if (result.data.result) {
                        this.$dialog.toast({ mes: '评论成功！', timeout: 1500 });
                        this.notes.forEach(element => {
                            if (element.id === this.note_id) {
                                element.comment.push({
                                    headimgurl: this.memberInfo.headimgurl,
                                    id: this.memberInfo.id,
                                    noteComment: this.commit,
                                    noteId: this.note_id,
                                    // receiverId: 5,
                                    // senderId: 5,
                                    senderName: this.memberInfo.nickname,
                                })
                            }
                        });
                        this.notes = JSON.parse(JSON.stringify(this.notes))
                        this.note_id = ''
                        this.commit = ''
                        this.isShowInput = false
                    } else {
                        this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                    }
                })
            }
        },
        toMynotes() {
            this.$router.push('/travel/mynotes')
        },
        toRelease() {
            this.$router.push('/travel/release')
        },
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}