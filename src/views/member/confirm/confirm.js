/*
 * @Author: veggieg8 
 * @Date: 2018-05-02 14:40:12 
 * @Last Modified by: veggieg8
 * @Last Modified time: 2018-05-17 16:17:06
 */

import Vue from 'vue';
export default {
    data() {
        return {
            collectList: [],
            limit: 100,
            offset: 0,
            message: '',
            serve_address: '', // 省市区地址
            detail_address: '', // 详细地址
            name: "",
            mobile: "",
            city: "", //省市区数组
            good: {},
            address_id: ''
        }
    },
    watch: {},
    mounted: function() {

        if (this.$route.query.id) {
            this.getDetail()
        } else {
            this.$router.go(-1);
        }
        if (this.$route.query.addressid) {
            this.getAddress();
        } else {
            this.getDefaultAddress();
        }


    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        confirmOrder() {
            if (this.address_id === '' || this.address_id === undefined || this.address_id === null) {
                this.$dialog.toast({ mes: '请选择一个收货地址！', timeout: 2000 });
                return;
            }
            this.axios.post("/wechatauth/integral/goods/purchase", {
                integral_good_id: this.$route.query.id,
                address_id: this.address_id,
                mark: this.message,
            }).then(res => {
                console.log(res.data)
                if (res.data.result) {
                    this.$dialog.toast({ mes: '兑换成功！', timeout: 600 });
                    this.$router.push('/member/personal')
                } else {
                    this.$dialog.toast({ mes: res.data.mesage, timeout: 600 });
                }
            })
        },
        toPage: function() {
            this.$router.push('/member/manageAddress?goodid=' + this.$route.query.id + '&fromaddress=confirm')
        },
        timeDeformate(time) {
            if (time) {
                return time.split(" ")[0]
            }
        },
        getAddress() {
            this.axios.get('/wechatauth/user/address/detail', {
                params: {
                    id: this.$route.query.addressid
                }
            }).then(res => {
                if (res.data.result) {
                    let address = res.data.datas
                    this.address_id = address.id
                    this.name = address.consignee;
                    this.mobile = address.reapMobile;
                    this.serve_address = address.reapProvince + ' ' + address.reapCity + ' ' + address.reapCounty
                    this.city = this.serve_address.split(" ");
                    this.detail_address = address.detailAddress;
                }
            })
        },
        //获取默认地址
        getDefaultAddress() {
            this.axios.get('/wechatauth/user/address/default').then(res => {
                if (res.data.result) {
                    let address = res.data.datas
                    this.address_id = address.id
                    this.name = address.consignee;
                    this.mobile = address.reapMobile;
                    this.serve_address = address.reapProvince + ' ' + address.reapCity + ' ' + address.reapCounty
                    this.city = this.serve_address.split(" ");
                    this.detail_address = address.detailAddress;
                }
            })
        },
        // 获取商品详情
        getDetail() {
            this.axios.get('/wechatauth/integral/goods/search', {
                params: {
                    limit: 1000,
                    offset: 0,
                }
            }).then(res => {
                if (res.data.result) {
                    this.collectList = res.data.datas.rows;
                    this.collectList.every(element => {
                        if (Number(element.id) === Number(this.$route.query.id)) {
                            this.good = element
                            return false;
                        } else {
                            return true;
                        }
                    });
                } else {
                    this.collectList = []
                }
            })
        },


    }
}