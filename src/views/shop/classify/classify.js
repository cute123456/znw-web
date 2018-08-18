import Vue from 'vue'
import fixBottom from '@/components/fixBottom'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

export default {
    data() {
        return {
            activeId: 1,
            oneClass: [{
                    "id": 1,
                    "class_logo": "http://apitest.qumengkeji.com/images/classify/e795f27b2e23be977de78e0dc95d08b0.jpg",
                    "class_name": "易豆专区",
                    "parentid": 0,
                    "train": 1
                },
                {
                    "id": 4,
                    "class_logo": "http://apitest.qumengkeji.com/images/classify/ff40fbc601f5dd47a9d6895a75faacf5.jpg",
                    "class_name": "食品特产",
                    "parentid": 0,
                    "train": 2
                },
                {
                    "id": 2,
                    "class_logo": "http://apitest.qumengkeji.com/images/classify/3dc70c3f073dbb7ecdf571be2be7c5e0.jpg",
                    "class_name": "本地生活",
                    "parentid": 0,
                    "train": 3
                },
                {
                    "id": 6,
                    "class_logo": "http://apitest.qumengkeji.com/upload/9b76651f20a7a111451e9186c4ab62b5.png",
                    "class_name": "手机数码",
                    "parentid": 0,
                    "train": 4
                },
                {
                    "id": 3,
                    "class_logo": "http://apitest.qumengkeji.com/upload/42a20cdc1a45d10b84fd4a2b0c7a827d.png",
                    "class_name": "家用电器",
                    "parentid": 0,
                    "train": 5
                },
                {
                    "id": 5,
                    "class_logo": "http://apitest.qumengkeji.com/upload/5935cafe00aee70ea1d547b920899f10.png",
                    "class_name": "服鞋箱包",
                    "parentid": 0,
                    "train": 6
                },
            ], // 一级分类
            secondClass: [{
                    "id": 17,
                    "class_logo": "http://apitest.qumengkeji.com/images/classify/245753bb61f9a5d89c8e7ad48d48eae7.jpg",
                    "class_name": "酒水饮料",
                    "parentid": 1,
                    "train": 1
                },
                {
                    "id": 16,
                    "class_logo": "http://apitest.qumengkeji.com/images/classify/21be7473421b4690bea9fe677f557c02.jpg",
                    "class_name": "餐饮住宿",
                    "parentid": 1,
                    "train": 2
                },
                {
                    "id": 21,
                    "class_logo": "http://apitest.qumengkeji.com/images/classify/be2387aca477ab9779c17c213feaee91.jpg",
                    "class_name": "手机数码",
                    "parentid": 1,
                    "train": 3
                },
                {
                    "id": 23,
                    "class_logo": "http://apitest.qumengkeji.com/images/classify/fefd2dd709ec2a770c642688d9fe79bb.jpg",
                    "class_name": "服鞋箱包",
                    "parentid": 1,
                    "train": 4
                },
                {
                    "id": 105,
                    "class_logo": "http://apitest.qumengkeji.com/images/classify/44b9efdc9e895c8d6b7cd84eb3d5c34c.jpg",
                    "class_name": "休闲娱乐",
                    "parentid": 1,
                    "train": 5
                },
                {
                    "id": 106,
                    "class_logo": "http://apitest.qumengkeji.com/images/classify/4040f0e45ac21049572c5f4cf271511e.jpg",
                    "class_name": "日用百货",
                    "parentid": 1,
                    "train": 6
                },
            ], // 二级分类
            selectedValue: '',
            message: '', //搜索的内容
        }
    },
    components: {
        fixBottom,
    },
    created() {
        // this.getLists()
        if (sessionStorage.getItem('classId')) {
            this.activeId = sessionStorage.getItem('classId')
        } else {
            this.activeId = this.$route.query.id
        }
    },
    methods: {
        // 搜索
        search() {
            this.$router.push('/shop/list?searchCon=' + this.message)
        },
        getClassify(id) { // 切换一级分类
            //获取对应的二级分类
            this.activeId = id
            sessionStorage.setItem('classId', id)

            this.axios.get('/class/list', {
                params: {
                    parentid: id
                }
            }).then(res => {
                // this.secondClass = res.data.datas
            })

        },
        // 获得左侧分类列表信息
        getLists() {
            this.axios.get('/class/list', {
                params: {
                    parentid: 0
                }
            }).then(res => {
                // this.oneClass = res.data.datas
                // this.getClassify(this.activeId)
            })
        },
        // 跳转到详情
        golist(id, name) {
            this.$router.push('/shop/list?id=' + id + '&type=' + name);
        }
    },
    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid") }).then((res) => {
    //             console.log(res)
    //             if (res.data.result) {
    //                 vm.shareImgData = res.data.datas.share_img
    //                 vm.shareUrl = res.data.datas.share_url
    //                 console.log('vm.shareUrl', vm.shareUrl)
    //             }
    //         });
    //     });
    // },
    // beforeCreate() {
    //     this.SDKRegister(this, () => {
    //         console.log('分类页调用分享')
    //     })
    // }
}