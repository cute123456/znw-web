import Vue from 'vue';

export default {
    data() {
        return {
            Area: [],
            cityList: [],
            info: {
                name: '',
                mobile: '',
                schoolid: '',
                schoolname: '',
                nation: '',
                needList: [], // 选择的2级城市列表
                countList: [], // 方便统计某一一级城市下选择的2级城市数
                AreaList: [] //1级城市列表
            },
            selectedIndex: "",
            isHaveSame: Boolean,
        }
    },
    watch: {},
    mounted: function() {
        if (sessionStorage.getItem("Area")) {
            this.Area = JSON.parse(sessionStorage.getItem("Area"))
            if (this.Area.length != 0) {
                this.selectedIndex = this.Area[0].id
                this.getCity(this.Area[0].id)
            }
        } else {
            this.getProvince();
        }
        // if (sessionStorage.getItem("cityList")) {
        //     this.cityList = JSON.parse(sessionStorage.getItem("cityList"))
        // }
        if (sessionStorage.getItem("AreaList")) {
            this.info.AreaList = JSON.parse(sessionStorage.getItem("AreaList"))
        }
        if (sessionStorage.getItem("needList")) {
            this.info.needList = JSON.parse(sessionStorage.getItem("needList"))
        }
        if (sessionStorage.getItem("countList")) {
            this.info.countList = JSON.parse(sessionStorage.getItem("countList"))
        }
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        // 获取省份列表
        getProvince() {
            this.axios.get('/wechatauth/province/list').then(res => {
                if (res.data.result) {
                    this.Area = res.data.datas
                    if (this.Area.length != 0) {
                        this.selectedIndex = this.Area[0].id
                        this.getCity(this.Area[0].id)
                    }
                } else {
                    this.Area = []
                }
            })
        },
        // 获取省份列表
        getCity(id) {
            this.axios.get('/wechatauth/city/list', {
                params: {
                    id: id
                }
            }).then(res => {
                if (res.data.result) {
                    this.cityList = res.data.datas
                    for (var i = 0; i < this.info.needList.length; i++) {
                        this.cityList.forEach(element => {
                            if (element.name == this.info.needList[i]) {
                                element.isNeed = true
                            }
                        });
                    }
                    this.cityList = JSON.parse(JSON.stringify(this.cityList))
                } else {
                    this.cityList = []
                }
            })
        },
        //统计数组中相同元素的个数
        couontNum(result) {
            var arr = []
            result.sort()
            for (var i = 0; i < result.length;) {
                var count = 0;
                for (var j = i; j < result.length; j++) {
                    if (result[i] === result[j]) {
                        count++;
                    }
                }
                arr.push({
                    date: result[i],
                    count: count
                })
                i += count;
            }

            for (var k = 0; k < arr.length; k++) {
                console.log(arr[k])
            }
        },
        /**
         * 获取数组中相同元素的个数
         * @param val 相同的元素
         * @param arr 传入数组
         */
        getSameNum(val, arr) {
            let processArr = arr.filter(function(value) {
                return value == val;
            })
            return processArr.length;
        },
        getClassify: function(index) {
            this.selectedIndex = index;
            this.getCity(index);
        },
        selectNeed: function(obj) {
            if (this.info.needList.length === 0) {
                this.info.needList.push(obj.name)
                this.info.countList.push(obj.provinceId)
                obj.isNeed = true
                this.Area.forEach(element => { //当地区列表为空时，可直接push
                    if (element.id === obj.provinceId) {
                        this.info.AreaList.push({
                            name: element.name,
                            selected: true
                        })
                    }
                });
            } else {
                var List = this.info.needList
                this.info.needList.every((element, index) => { //判断如果已经存在该元素，则删除该元素
                    if (String(element) === String(obj.name)) {
                        obj.isNeed = false
                        List.splice(index, 1)
                        this.info.needList = List
                        this.isHaveSame = true
                        return false;
                    } else {
                        this.isHaveSame = false
                        return true;
                    }
                });

                if (this.isHaveSame) {
                    var listtwo = this.info.countList
                    this.info.countList.every((element, index) => {
                        if (Number(element) === Number(obj.provinceId)) {
                            listtwo.splice(index, 1)
                            this.info.countList = listtwo
                            return false;
                        } else {
                            return true;
                        }
                    });
                    if (this.getSameNum(obj.provinceId, this.info.countList) <= 0) { //操作完this.info.countList判断当传进来的元素个数是否为0
                        console.log('要删除重复的啦')
                        if (this.info.countList.length === 0) {
                            this.info.AreaList = []
                        } else {
                            // this.Area.forEach(el => { //删除要除去的一级城市
                            //     var deletname = el.name
                            //     if (el.id === obj.provinceId) {
                            //         this.info.AreaList = this.info.AreaList.filter(word => word.name != deletname);
                            //     }
                            // });
                            for (var j = 0; j < this.Area.length; j++) {
                                if (this.Area[j].id == obj.provinceId) {
                                    this.info.AreaList = this.info.AreaList.filter(word => word.name != this.Area[j].name);
                                }
                            }
                        }
                    }
                }
                if (!this.isHaveSame) {
                    this.info.needList.push(obj.name)
                    this.info.countList.push(obj.provinceId)
                    this.Area.forEach(element => { //当地区没有相同元素时，可直接push
                        if (element.id === obj.provinceId) {
                            this.info.AreaList.push({
                                name: element.name,
                                selected: true
                            })
                        }
                    });
                    obj.isNeed = true

                }
            }
            //操作一级城市是否显示已选个数
            this.Area.forEach(element => {
                if (element.id === obj.provinceId) {
                    element.selectnum = this.getSameNum(obj.provinceId, this.info.countList)
                    if (element.selectnum > 0) {
                        element.selected = true
                    } else {
                        element.selected = false
                    }
                }
            });
            // sessionStorage.setItem("cityList", JSON.stringify(this.info.needList));
            this.cityList = JSON.parse(JSON.stringify(this.cityList));
            // console.log('this.info.needList', JSON.stringify(this.info.needList))
            // console.log('this.info.countList', JSON.stringify(this.info.countList))
            // console.log('cityList', this.cityList)
            // console.log('this.Area', this.Area)
            // console.log('this.AreaList', this.info.AreaList)
        },
        save() {
            sessionStorage.setItem("Area", JSON.stringify(this.Area));
            sessionStorage.setItem("cityList", JSON.stringify(this.cityList));
            sessionStorage.setItem("AreaList", JSON.stringify(this.info.AreaList));
            sessionStorage.setItem("needList", JSON.stringify(this.info.needList));
            sessionStorage.setItem("countList", JSON.stringify(this.info.countList));
            this.$router.push('/travel/lightmap')
        },
    },
}