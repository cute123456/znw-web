import Vue from 'vue';
// 引入基本模板
// import echarts from 'echarts'
import "../../../../node_modules/echarts/dist/echarts.min.js"
import "../../../../node_modules/echarts/map/js/china.js"
let echarts = require('echarts/lib/echarts')
require("echarts/lib/chart/map");
require("echarts/lib/component/visualMap");
// import '/static/js/china.js'

export default {
    data() {
        return {
            AreaList: [],
            needList: [],
            memberInfo: {},
            isShowImg: false,
            total_num: 0,
            persent: '0%',
            qrCode: ''
        }
    },
    watch: {},
    mounted: function() {
        this.getQrcode();
        if (sessionStorage.getItem("AreaList")) {
            this.AreaList = JSON.parse(sessionStorage.getItem("AreaList"))
        }
        if (sessionStorage.getItem("needList")) {
            this.needList = JSON.parse(sessionStorage.getItem("needList"))
            this.total_num = this.needList.length
        }
        this.getFootprint()
        this.getMemberInfo();
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        // 获取省份列表
        getFootprint() {
            this.axios.get('/wechatauth/user/footprint/mine', {
                params: {
                    total_address: this.total_num
                }
            }).then(res => {
                if (res.data.result) {
                    this.persent = res.data.datas
                } else {
                    this.persent = '0%'
                }
            })
        },
        getArrLength(array) {
            if (array.length != 0) {
                var r = [];
                for (var i = 0, l = array.length; i < l; i++) {
                    for (var j = i + 1; j < l; j++)
                        if (array[i].name == array[j].name) j == ++i;
                    r.push(array[i]);
                }
                return r.length
            } else {
                return 0;
            }

        },
        // 获取二维码
        getQrcode() {
            this.axios.get('/wechatauth/user/qrcode').then(res => {
                if (res.data.result) {
                    this.qrCode = res.data.datas
                } else {
                    this.qrCode = ''
                }
            })
        },
        // 获取用户信息
        getMemberInfo() {
            this.axios.get('/wechatauth/user/info').then(res => {
                if (res.data.result) {
                    this.memberInfo = res.data.datas
                    this.drowMap()
                } else {
                    this.memberInfo = {}
                }
            })
        },
        toSelect() {
            // sessionStorage.clear();
            this.$router.push('/travel/selectcity')
        },
        generateImg() {
            document.getElementById('myCanvas').style.display = 'none'
            this.isShowImg = true
        },
        closeImg() {
            document.getElementById('myCanvas').style.display = 'unset'
            this.isShowImg = false
        },
        drowMap() {
            var that = this
            var citysnum = this.getArrLength(this.AreaList)
            var citynum = this.needList.length
            var citylist = ''
            for (var i = 0; i < citynum; i++) {
                var citylist = citylist + " " + this.needList[i]
            }
            if (document.getElementById('TravelMap')) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = echarts.init(document.getElementById('TravelMap'));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}'
                    },
                    series: [{
                        name: '中国',
                        type: 'map',
                        mapType: 'china',
                        zoom: 1.2, //放大，这里是关键，一定要放在 series中
                        selectedMode: 'multiple', //single,multiple多选
                        // selectedMode: false,
                        //禁止点击
                        silent: true,
                        // 普通样式。
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false,
                                    textStyle: {
                                        color: "#231816"
                                            // color: "#eeeeee"
                                    },
                                    // position: ['35%', '70%']
                                },
                                areaColor: '#B1D0EC',
                                color: '#B1D0EC',
                                borderColor: '#dadfde' //区块的边框颜色
                            },
                            // 高亮样式。
                            emphasis: { //鼠标hover样式
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: '#fa4f04'
                                    },
                                    position: ['35%', '70%'],
                                    fontSize: 12,
                                    align: 'center',
                                    verticalAlign: 'middle'
                                }
                            }
                        },
                        // data: [
                        //     { name: '四川', selected: true },
                        // ]
                        data: this.AreaList
                    }]
                };
                // var ecConfig = require('echarts/config');
                // myChart.on(ecConfig.EVENT.MAP_SELECTED, function(param) {
                //     var selected = param.selected;
                //     var urlArr = ['http://www.baidu.com', 'http://http://www.cnblogs.com/sapho'];
                //     for (var p in selected) {
                //         if (selected[p]) {
                //             switch (p) {
                //                 case '河南':
                //                     location.href = urlArr[0];
                //                     break;
                //                 case '重庆':
                //                     location.href = urlArr[1];
                //                     break;
                //                 default:
                //                     break;
                //             }
                //         }
                //     }
                // });
                // 为echarts对象加载数据
                myChart.setOption(option);
                document.getElementById('TravelMap').style.display = 'none';
                var canvasList = document.getElementById('myCanvas');
                var canvas = document.createElement('canvas');
                canvasList.appendChild(canvas);
                // var canvas = document.getElementById("mycanvas");
                var gWinHeight = document.body.clientHeight; //获取屏幕高度
                var gWinWidth = document.body.clientWidth; //获取屏幕宽度
                canvas.width = gWinWidth;
                // canvas.height = 450;
                canvas.height = gWinHeight;
                var ctx = canvas.getContext('2d');
                var bgElement = document.getElementById('bg-img'); //声明蓝色背景图片
                // var mapElement = document.getElementById('map-img'); //声明蓝色背景图片
                var mapElement = new Image()
                mapElement.setAttribute("crossOrigin", 'Anonymous')
                mapElement.src = '/static/img/travel/map-bg.png'
                mapElement.onload = function() {
                    ctx.drawImage(bgElement, 0, 0, canvas.width, canvas.height);
                    ctx.drawImage(mapElement, 0, 110, canvas.width, 326);
                    // 将地图放到新建的canvas上----------开始
                    var offcanvas = myChart.getRenderedCanvas({
                        pixelRatio: 1,
                        // backgroundColor: '#fff'
                    });
                    ctx.drawImage(offcanvas, 0, 80);
                    // 将地图放到新建的canvas上---------结束
                    ctx.font = "23px PingFang-SC-Medium";
                    ctx.fillStyle = "#ffdb17";
                    ctx.fillText(that.memberInfo.nickname, 25, 40);
                    ctx.font = "16px PingFang-SC-Medium";
                    ctx.fillStyle = "#060606";
                    ctx.fillText("踏足中国", 25, 75);
                    ctx.font = "28px PingFang-SC-Medium";
                    ctx.fillStyle = "#ffdb17";
                    // ctx.fillText("2", 95, 80);
                    ctx.fillText(citysnum, 95, 80);
                    if (citysnum > 9) {
                        ctx.font = "16px PingFang-SC-Medium";
                        ctx.fillStyle = "#060606";
                        ctx.fillText("个省区，", 130, 75);
                        ctx.font = "28px PingFang-SC-Medium";
                        ctx.fillStyle = "#ffdb17";
                        // ctx.fillText("2", 180, 80);
                        ctx.fillText(citynum, 185, 80);
                        ctx.font = "16px PingFang-SC-Medium";
                        ctx.fillStyle = "#060606";
                        ctx.fillText("个城市", 220, 75);
                    } else {
                        ctx.font = "16px PingFang-SC-Medium";
                        ctx.fillStyle = "#060606";
                        ctx.fillText("个省区，", 115, 75);
                        ctx.font = "28px PingFang-SC-Medium";
                        ctx.fillStyle = "#ffdb17";
                        // ctx.fillText("2", 180, 80);
                        ctx.fillText(citynum, 180, 80);
                        if (citynum > 9) {
                            ctx.font = "16px PingFang-SC-Medium";
                            ctx.fillStyle = "#060606";
                            ctx.fillText("个城市", 220, 75);
                        } else {
                            ctx.font = "16px PingFang-SC-Medium";
                            ctx.fillStyle = "#060606";
                            ctx.fillText("个城市", 200, 75);
                        }
                    }

                    ctx.font = "16px PingFang-SC-Medium";
                    ctx.fillStyle = "#060606";
                    ctx.fillText("超越了", 25, 108);
                    ctx.font = "28px PingFang-SC-Medium";
                    ctx.fillStyle = "#ffdb17";
                    ctx.fillText(that.persent, 75, 110);
                    ctx.font = "16px PingFang-SC-Medium";
                    ctx.fillStyle = "#060606";
                    ctx.fillText("的用户", 160, 108);


                    // ctx.font = "15px PingFang-SC-Medium";
                    // ctx.fillStyle = "#060606";
                    // ctx.fillText("上海 天津 南昌 温州 大理 ", 25, 410);
                    /****绘制自动换行的字符串****/
                    var t = citylist
                    var chr = t.split("");
                    var temp = "";
                    var row = [];
                    ctx.font = "15px PingFang-SC-Medium";
                    ctx.fillStyle = "#060606";
                    ctx.textBaseline = "middle";
                    for (var a = 0; a < chr.length; a++) {
                        if (ctx.measureText(temp).width < (gWinWidth - 50)) {;
                        } else {
                            row.push(temp);
                            temp = "";
                        }
                        temp += chr[a];
                    }
                    row.push(temp);
                    for (var b = 0; b < row.length; b++) {
                        ctx.fillText(row[b], 25, 390 + (b + 1) * 20);
                    }
                    /****绘制自动换行的字符串--------结束****/
                    var codeElement = document.getElementById('code-img'); //声明二维码图片
                    ctx.drawImage(codeElement, canvas.width / 2 - 40, canvas.height - 180, 80, 80); //添加二维码图片
                    document.getElementById('qrcode').src = canvas.toDataURL("image/jpg");

                }
            }
        },
    }
}