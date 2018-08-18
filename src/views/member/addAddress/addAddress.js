import Vue from 'vue'

// import NavHead from '@/components/navHead/navHead'
import District from 'ydui-district/dist/jd_province_city_area_id'
import { CitySelect } from 'vue-ydui/dist/lib.px/cityselect'
import { Toast } from 'vue-ydui/dist/lib.px/dialog'
import WechatPlugin from "vux/src/plugins/wechat/index.js"

Vue.prototype.$dialog = {
    toast: Toast,
};
Vue.component(CitySelect.name, CitySelect)

export default {
    data() {
        return {
            check: false,
            district: District,
            city: [], // 省市区地址数组
            serve_address: '', // 省市区地址
            detail_address: '', // 详细地址
            noAdder: true,
            consignee: '',
            reap_mobile: '',
            addresses: '', // 地址列表
            is_default: 0,
        }
    },
    components: {
        // NavHead,
        Toast
    },
    methods: {
        result1(ret) {
            this.serve_address = ret.itemName1 + ' ' + ret.itemName2 + ' ' + ret.itemName3;
            this.city = [ret.itemName1, ret.itemName2, ret.itemName3]
        },
        coverChecked() {
            this.check = true
        },
        save() {
            if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.reap_mobile)) {
                Toast({
                    mes: '请输入正确的手机号',
                    timeout: 400
                });
                return false;
            }
            if (this.consignee == "" || this.detail_address == "") {
                Toast({
                    mes: '请将信息填写完整',
                    timeout: 400
                });
                return false;
            }
            this.axios.post("/wechatauth/user/address/add", {
                // uid: localStorage.getItem('uid'),
                consignee: this.consignee,
                reap_mobile: this.reap_mobile,
                is_default: this.is_default,
                reap_province: this.city[0],
                reap_city: this.city[1],
                reap_county: this.city[2],
                detail_address: this.detail_address
            }).then(res => {
                console.log(res.data)
                if (res.data.result) {
                    this.$dialog.toast({ mes: '添加成功！', timeout: 600 });
                    this.$router.go(-1)
                } else {
                    this.$dialog.toast({ mes: res.data.mesage, timeout: 600 });

                }
            })
        },

    },
    created() {},
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
    beforeCreate() {
        this.SDKRegister(this, () => {

        })
    },
}