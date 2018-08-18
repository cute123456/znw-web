import Vue from 'vue'
import fixBottom from '@/components/fixBottom'
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'
// import XButton from 'vux/src/components/x-button/index.vue'
// import Confirm from 'vux/src/components/confirm/index.vue'
import { Toast } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
    toast: Toast,
};



export default {
    name: 'cart',
    data() {
        return {
            checkAll: false,
            shopPart: false, // 店铺全选
            totalMoney: 0, // 需支付金额
            totalYmoney: 0, // 需支付豆数
            delFlag: false,
            curDel: '',
            editFlag: false, // 编辑购物车
            toDelect: false,
            bussinessId: '', // 店铺id
            shopCar: {}, //
            shopData: [],
            orderId: {}, // 生成的订单id
        }
    },
    components: {
        fixBottom,
        // XButton,
        // Confirm,
        Checker,
        CheckerItem,

    },
    beforeRouteEnter(to, from, next) {
        // Indicator.open();
        next(vm => {
            vm.axios.post("/qrcode/share/generate", { openid: localStorage.getItem("openid") }).then((res) => {
                // console.log(res)
                if (res.data.result) {
                    vm.shareImgData = res.data.datas.share_img
                    vm.shareUrl = res.data.datas.share_url
                        // console.log('vm.shareUrl',vm.shareUrl)
                }
            });
        });
    },
    computed: {
        shopNoneFlag: function() { // 购物车中有无商品
            let num = 0
            for (let i in this.shopCar) {
                num++
            }
            return num
        },
        checkNum: function() { // 选中的商品数量
            let num = 0;
            for (let i in this.shopCar) {
                for (let j in this.shopCar[i].goods) {
                    if (this.shopCar[i].goods[j].checked) {
                        num++
                    }
                }
            }
            return num;
        },
        orderStorage: function() { // 选中的商品信息
            var order_storage = {}
            for (let i in this.shopCar) {
                for (let j in this.shopCar[i].goods) {
                    if (this.shopCar[i].goods[j].checked) {
                        if (!order_storage[i]) {
                            order_storage[i] = {}
                        }
                        order_storage[i][j] = this.shopCar[i].goods[j]
                    }
                }
            }
            return order_storage
        },
    },
    created() {
        this.getGoods()
    },
    methods: {
        // 获取商品
        getGoods() {

            this.shopCar = JSON.parse(localStorage.getItem('shopCar'))
                // console.log('读取this.shopCar', this.shopCar)
            if (!this.shopCar) {
                this.shopData = []
                return;
            }
            for (let i in this.shopCar) { // 循环店铺
                for (let j in this.shopCar[i].goods) { // 循环店铺里的商品
                    // this.axios.get('/goods/get', { // 获取详细信息
                    //     params: {
                    //         id: j,
                    //     }
                    // }).then(res => {
                    // console.log(res)
                    // var shopProduct = res.data.datas.goods;
                    var shopProduct = { // 商品详情
                        business: {
                            b_audit: 1,
                            b_city: "南昌市",
                            b_county: "青山湖区",
                            b_description: null,
                            b_detail_address: "北京东路锦海东方银座",
                            b_img: "upload/d1750fd604a4892b4484e23fe0ac8ca0.jpg",
                            b_mobile: 13265308041,
                            b_name: "微聚玩具专营店",
                            b_province: "江西",
                            b_routine_beans: "0.10",
                            b_routine_fee: "0.10",
                            b_type: 1,
                            b_uid: 1417,
                            b_uname: "李顺 ",
                            b_use_beans: 1,
                            b_yratio: "1.000",
                            created_at: "2018-03-22 14:32:51",
                            id: 172,
                            updated_at: "2018-03-22 14:33:15"
                        },
                        admin_off_shelve: 0,
                        created_at: "2018-03-22 14:41:20",
                        g_bid: 172,
                        g_class_id: 172,
                        g_count: 299,
                        g_daygroom: 0,
                        g_description: "<p>微聚优教百变托马斯轨道车拼装电动极速轨道儿童益智玩具创意diy玩具 快乐童年 快乐生活 自由组装，锻炼孩子想象力</p>",
                        g_freight: 0,
                        g_input_farclass: null,
                        g_input_kidclass: null,
                        g_isapproval: 1,
                        g_isexpress: 1,
                        g_isgroom: 0,
                        g_isknock: 0,
                        g_isoffline: 0,
                        g_isyishop: 0,
                        g_name: "百变托马斯轨道车拼装电动轨道儿童益智玩具创意diy玩具",
                        g_pic: "upload/85ebc4cd1ffd463836e929572daab4c4.jpg",
                        g_pics: "upload/72c4b895b0e77997e96078ba88b68990.jpg,upload/30170b0dd73e8aae3c12b218faf4e229.jpg,upload/8f00d1910226cc395e9015c2cc4555f7.jpg,upload/6d2dd30c44688313483f8d4dd97d3e16.png",
                        g_price: "29.90",
                        g_routine_beans: "0.10",
                        g_routine_fee: "0.10",
                        g_sales: 1,
                        g_sales_add: 0,
                        g_total: 0,
                        g_yend_time: null,
                        g_yprice: 30,
                        g_yratio: "1.000",
                        g_ystar_time: null,
                        goodsStyle: [],
                        hidden_price: 0,
                        id: 453,
                        is_join_yigoods: 1,
                        off_shelve: 1,
                        review_count: 0,
                        updated_at: "2018-04-01 16:08:33"
                    }
                    shopProduct.model = this.shopCar[i].goods[j].model
                    shopProduct.quentity = this.shopCar[i].goods[j].quentity; //商品数量
                    shopProduct.businessId = this.shopCar[i].goods[j].businessId
                    shopProduct.singlePrice = 0
                        // console.log('this.shopCar[i].goods[j].model',this.shopCar[i].goods[j].model)
                    if (this.shopCar[i].goods[j].model) { // 如果有规格，单价为基础价+规格价之和

                        for (let m in this.shopCar[i].goods[j].model) {
                            shopProduct.singlePrice += parseFloat(this.shopCar[i].goods[j].model[m].ty_price)

                        }
                        if (shopProduct.singlePrice === 0) {
                            shopProduct.singlePrice = parseFloat(shopProduct.g_price).toFixed(2)
                        } else {
                            shopProduct.singlePrice = parseFloat(shopProduct.singlePrice).toFixed(2)
                        }

                    } else { // 没有规格，单价
                    }
                    shopProduct.uid = localStorage.getItem('uid') // 用户id
                    shopProduct.checked = false //商品是否被选中
                    this.shopData.push(shopProduct);
                    this.shopCar[i].goods[j] = shopProduct
                    this.shopCar[i].checked = false //店铺是否被选中
                        // })
                }
            }
        },
        selectProduct: function(goods, goodses) { // 单个商品选择
            goods.checked = !goods.checked;
            let flag = true
            for (let i in goodses) {
                flag = flag && goodses[i].checked
            }
            this.shopCar[goods.businessId].checked = flag
                // this.checkAll = flag;
            this.updateCheckAll()
            this.calctotalMoney();
        },
        selectShop: function(goodses, bid) { // 选择店铺
            this.shopCar[bid].checked = !this.shopCar[bid].checked
            for (let i in goodses) {
                goodses[i].checked = this.shopCar[bid].checked
            }
            this.updateCheckAll()
            this.calctotalMoney();
        },
        checkAllProduct: function() { // 全选
            for (let i in this.shopCar) {
                this.shopCar[i].checked = !this.checkAll
                for (let j in this.shopCar[i].goods) {
                    this.shopCar[i].goods[j].checked = !this.checkAll
                }
            }
            this.updateCheckAll()
            this.calctotalMoney();
        },
        updateCheckAll() { //更新checkall
            let flag = true
            let num = 0
            for (let i in this.shopCar) {
                num++
                if (!this.shopCar[i].checked) {
                    flag = false
                }
            }
            this.checkAll = flag && num
        },
        changeQuentity: function(goods, num) { // 加减按钮加减数量
            if (num > 0 && goods.quentity < goods.g_count) {
                goods.quentity++;
            } else if (num > 0 && goods.quentity >= goods.g_count) {
                this.$dialog.toast({ mes: '库存不足' });
            } else {
                if (goods.quentity > 1) {
                    goods.quentity--;
                } else {
                    this.$dialog.toast({ mes: '亲，已经最少了哦~' });
                }
            }
            this.calctotalMoney()

        },
        delProduct() { // 删除商品
            if (this.checkNum <= 0) {
                this.$dialog.toast({ mes: '您还没有选择商品' });
                return
            }
            if (this.checkAll) { // 全选删除
                this.shopCar = {}
            }
            for (let i in this.shopCar) {
                if (this.shopCar[i].checked) { // 店铺被选中
                    delete this.shopCar[i]
                } else {
                    for (let j in this.shopCar[i].goods) {
                        if (this.shopCar[i].goods[j].checked) {
                            delete this.shopCar[i].goods[j] // 删除店铺下的商品
                        }
                    }
                }
            }
            let temp = {}
            for (let i in this.shopCar) { // 循环店铺
                temp[i] = { name: this.shopCar[i].name, goods: {} }
                for (let j in this.shopCar[i].goods) { // 循环店铺里的商品
                    temp[i].goods[j] = { model: this.shopCar[i].goods[j].model, quentity: this.shopCar[i].goods[j].quentity, businessId: this.shopCar[i].goods[j].businessId }
                }
            }
            localStorage.setItem('shopCar', JSON.stringify(temp))

            this.calctotalMoney()
            this.updateCheckAll()
        },
        //计算总金额
        calctotalMoney: function() {
            this.totalMoney = 0;
            // this.totalYmoney = 0;
            for (let i in this.shopCar) {
                for (let j in this.shopCar[i].goods) {
                    if (this.shopCar[i].goods[j].checked) {
                        this.totalMoney += parseFloat(this.shopCar[i].goods[j].quentity) * parseFloat(this.shopCar[i].goods[j].singlePrice)
                            // this.totalYmoney += this.shopCar[i].goods[j].quentity * Math.ceil(this.shopCar[i].goods[j].singlePrice * this.shopCar[i].goods[j].g_yratio)
                    }
                }
            }
            this.totalMoney = parseFloat(this.totalMoney).toFixed(2)
                // this.totalYmoney = Math.ceil(this.totalYmoney)
        },
        goToSettlement: function() { // 下单

            if (this.checkNum != 0) {
                // this.axios.post('/order/add', {
                //     goods: this.orderStorage
                // }).then(res => {
                //     if (res.data.result) {
                // this.delProduct() // 去结算删除购物车


                this.$dialog.toast({ mes: '成功生成订单', timeout: 1500 });
                this.delProduct() // 去结算删除购物车 

                this.$router.push('/shop/settlement?orderId=' + 1384)

                //     } else {
                //         this.$dialog.toast({ mes: res.data.message, timeout: 1000 });
                //     }
                // })
            } else {
                this.$dialog.toast({ mes: '您还没有选择商品！', timeout: 1000 });
            }
        },
    },
    // beforeCreate(){
    //     this.SDKRegister(this, ()=>{
    //         console.log('购物车页调用分享')
    //     })
    // }
}