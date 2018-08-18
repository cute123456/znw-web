import Vue from 'vue'
import fixBottom from '@/components/fixBottom'
import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar';
import { Slider, SliderItem } from 'vue-ydui/dist/lib.rem/slider';
import 'vue-ydui/dist/ydui.base.css'

Vue.component(ProgressBar.name, ProgressBar);
Vue.component(Slider.name, Slider);
Vue.component(SliderItem.name, SliderItem);


export default {
    name: 'home',
    data() {
        return {
            // 搜索内容变量
            value: '',
            progress: '0.5',
            // 首页轮播图
            lunbo: {
                autoplay: 3000,
                imgList: [
                    "../../static/img/home/lun_1_03.png",
                    "./../static//img/home/lun_1_03.png",
                    "./../static//img/home/lun_1_03.png"
                ]
            },
            lists: [{
                    image: "./../static//img/home/sma_tu_25.png",
                    name: '一起去旅游',
                    time: '2018/03/24',
                    number: '2400人',
                    nbMoney: '￥20,000元',
                    nb: '目标筹资',
                    yiMoney: '￥10,000元',
                    yi: '已筹资',
                    zdMoney: '￥18,000元',
                    zd: '最低筹资'
                },
                {
                    image: "./../static//img/home/sma_tu_28.png",
                    name: '拯救地球',
                    time: '2018/03/24',
                    number: '2400人',
                    nbMoney: '￥20,000元',
                    nb: '目标筹资',
                    yiMoney: '￥10,000元',
                    yi: '已筹资',
                    zdMoney: '￥18,000元',
                    zd: '最低筹资'
                },
                {
                    image: "./../static//img/home/sma_tu_29.png",
                    name: '亲子组团跳伞',
                    time: '2018/03/24',
                    number: '2400人',
                    nbMoney: '￥20,000元',
                    nb: '目标筹资',
                    yiMoney: '￥10,000元',
                    yi: '已筹资',
                    zdMoney: '￥18,000元',
                    zd: '最低筹资'
                }
            ],
            isShowWelcom: false,
            invitedUsername: ""
        }
    },
    components: {
        fixBottom,
    },

    methods: {
        //跳转链接,如果包含www则为外部链接
        goHref(e) {
            if (e.indexOf("http") != -1) {
                window.location.href = e
            } else {
                // window.location.href = e
                // this.$dialog.toast({ mes: '功能暂未开放，先看看其他的内容吧~', timeout: 3000 });
            }
        },
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
        //计算进度
        compute(a, b) {
            if (a && b && a != 0 && b != 0) {
                var num = a / b
                var res = num * 100
                return res.toFixed(2);
            } else {
                return 0;
            }

        },
        //获取首页轮播图
        getImgList() {
            this.axios.get('/wechatauth/loops/list').then(res => {
                if (res.data.result) {
                    this.lunbo.imgList = res.data.datas
                        // console.log('this.lunbo.imgList', this.lunbo.imgList)
                } else {
                    this.lunbo.imgList = []
                }
            })
        },
        // 获取首页推荐的公益活动
        getRecommendedActivity() {
            this.axios.get('/wechatauth/benefit/recommended').then(res => {
                this.lists = res.data.datas
                this.lists.forEach(list => {
                    list.progress = list.raisedMoney / list.targetAmount
                });
                this.lists = JSON.parse(JSON.stringify(this.lists))
                    // console.log(this.lists)
            })
        },
        toPage(item) {
            if (item.type === 0) {
                window.location.href = '/welfare/itemDetail?id=' + item.id + '&fromtype=active'
                    // this.$router.push('/welfare/itemDetail?id=' + item.id + '&fromtype=active')
            } else {
                window.location.href = '/welfare/itemDetail?id=' + item.id + '&fromtype=project'
                    // this.$router.push('/welfare/itemDetail?id=' + item.id + '&fromtype=project')
            }
        },
        toSign() {
            this.$router.push('/member/sign')
        },
        toItem() {
            this.$router.push('/welfare/item')
        },
        toLearn() {
            this.$router.push('/learn/study')
        },
        toSport() {
            this.$router.push('/sport/sport')
        },
        toTravel() {
            this.$router.push('/travel/tourism')
        },
        toMind() {
            this.$dialog.toast({ mes: '功能暂未开放，先看看其他的内容吧~', timeout: 3000 });
        },
        joinUs() {
            this.axios.post('/wechatauth/user/mobile/bind/superior', {
                superior_id: this.$route.query.u
            }).then(result => {
                if (result.data.result) {
                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                    this.isShowWelcom = false;
                    window.name = "first";
                } else {
                    this.$dialog.toast({ mes: result.data.message, timeout: 3000 });
                    window.name == "";
                }
            })
        },
        // 获取用户信息
        getUserInfo() {
            this.axios.get('/wechatauth/user/uid', {
                params: {
                    uid: this.$route.query.u
                }
            }).then(res => {
                if (res.data.result) {
                    if (res.data.datas.realname && res.data.datas.realname != "") {
                        this.invitedUsername = res.data.datas.realname
                    } else if (res.data.datas.nickname && res.data.datas.nickname != "") {
                        this.invitedUsername = res.data.datas.nickname
                    } else {
                        this.invitedUsername = ""
                    }
                }
            })
        },

    },
    mounted() {
        if (window.name == "") {
            console.log('第一次进入页面执行，下次进入不执行！')
            if (this.$route.query.u) {
                this.getUserInfo();
                this.isShowWelcom = true;
            } else {
                this.isShowWelcom = false;
            }
        }

        this.getRecommendedActivity();
        this.getImgList();
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
}