import Vue from 'vue';
import { ProgressBar } from 'vue-ydui/dist/lib.rem/progressbar';
import '../../../../node_modules/fabric/dist/fabric.js'
Vue.component(ProgressBar.name, ProgressBar);

export default {
    data() {
        return {
            type: 1,
            willShow: false,
            isShowDay: false,
            status: true,
            lists: [{
                    time: '一',
                    checked: true,
                    number: '18',
                },
                {
                    time: '二',
                    checked: true,
                    number: '19',
                },
                {
                    time: '三',
                    checked: true,
                    number: '20',
                },
                {
                    time: '四',
                    checked: false,
                    number: '21',
                },
                {
                    time: '五',
                    checked: false,
                    number: '22',
                },
                {
                    time: '六',
                    checked: false,
                    number: '23',
                },
                {
                    time: '日',
                    checked: false,
                    number: '24',
                },
            ],
            bomb: [{
                tit: '打卡规则',
                textFir: '1、打卡时间为6:00~18:00。',
                textSec: '2、连续打卡天数一中断，即重新计算天数。',
                textThree: '3、前100名连续打卡30天即可送樟脑玩公仔一个。'

            }],
            bombs: [{
                tit: '补卡规则',
                textFir: '1、打卡时间为6:00~18:00。',
                textSec: '2、连续打卡天数一中断，即重新计算天数。',
                textThree: '3、打卡获取的积分可以累积。',
                textFour: '4、打卡获取的积分可以累积。'

            }],
            data: [],
            bigData: "",
            isCheck: false,
            haveCheck: [],
            zn_Month: '',
            en_Month: '',
            PunchTime: 0,
            today: Number,
            daily: {}
        }
    },
    mounted: function() {
        this.showWeekFirstDay();
        var Nowdateone = new Date();
        this.today = Nowdateone.getDate()
        if (this.today >= 0 && this.today <= 9) {
            this.today = "0" + this.today;
        }
        // this.getDaily();
    },
    beforeCreate() {
        this.SDKRegister(this, () => {})
    },
    methods: {
        // open() {
        //     this.isShowDay = true
        //     this.drow()
        // },
        close() {
            this.isShowDay = false
        },
        getDaily() {
            this.axios.get('/wechatauth/sign/share').then(res => {
                if (res.data.result) {
                    this.daily = res.data.datas
                    setTimeout(() => {
                        this.drow();
                    }, 500);
                } else {
                    this.daily = {}
                }
            })
        },
        drow() {
            var that = this
            var gWinHeight = document.body.clientHeight; //获取屏幕高度
            var gWinWidth = document.body.clientWidth; //获取屏幕宽度
            var bgwidth = gWinWidth - 40
            var bgheight = gWinHeight * 0.71
            if (document.getElementById("myCanvas")) {
                var canvasList = document.getElementById('myCanvas');
                var canvas = document.createElement('canvas');
                canvasList.appendChild(canvas);
                canvas.width = bgwidth;
                canvas.height = 453;
                // canvas.style.backgroundImage = 'url(/static/img/sign/daybg.png)';
                // canvas.style.backgroundPosition = '0% 0%';
                // canvas.style.backgroundRepeat = 'no-repeat'
                // canvas.style.backgroundSize = '100% 100%'
                canvas.style.position = 'absolute'
                canvas.style.top = '50px'
                canvas.style.left = '20px'
                canvas.style.right = '20px'
                    // var c = document.getElementById("myCanvas");
                var ctx = canvas.getContext("2d");


                var bgElement = document.getElementById('bg-img'); //声明背景图片
                ctx.drawImage(bgElement, 0, 0, canvas.width, canvas.height);
                // var imgElement = document.getElementById('jspang-img'); //声明头像图片
                var codeElement = document.getElementById('code-img'); //声明二维码图片
                var dayimg = new Image()
                dayimg.setAttribute("crossOrigin", 'Anonymous')
                    // dayimg.src = 'http://znwapi.anasit.com/' + this.daily.image
                dayimg.src = '/static/img/sign/dayImg.png'
                dayimg.onload = function() {
                        ctx.drawImage(dayimg, 15, 11, bgwidth - 30, 250);
                    }
                    // ctx.font = "13px PingFang-SC-Regular";
                    // ctx.fillText("清晨的雨露清澈透明，欢快的喜鹊掩饰不住心中的喜悦，轻轻的问候一声：早安开心一整天。", 15, 280);
                    /****绘制自动换行的字符串****/
                var t = this.daily.hint
                var chr = t.split("");
                var temp = "";
                var row = [];
                ctx.font = "13px PingFang-SC-Regular";
                ctx.fillStyle = "black";
                ctx.textBaseline = "middle";
                for (var a = 0; a < chr.length; a++) {
                    if (ctx.measureText(temp).width < (bgwidth - 40)) {;
                    } else {
                        row.push(temp);
                        temp = "";
                    }
                    temp += chr[a];
                }
                row.push(temp);
                for (var b = 0; b < row.length; b++) {
                    ctx.fillText(row[b], 15, 265 + (b + 1) * 20);
                }
                /****绘制自动换行的字符串--------结束****/
                var imgElement = new Image()
                imgElement.setAttribute("crossOrigin", 'Anonymous')
                    // imgElement.src = 'http://znwapi.anasit.com/' + this.daily.headImage
                imgElement.src = '/static/img/sign/headimg.jpg'
                imgElement.onload = function() {
                    //画出圆形头像
                    // ctx.clearRect(gWinWidth - 90, 205, 50, 50);
                    ctx.save(); // 保存当前ctx的状态
                    ctx.beginPath();
                    ctx.arc(53, 375, 25, 0, Math.PI * 2, false); //画出圆
                    ctx.clip(); //裁剪上面的圆形
                    ctx.drawImage(imgElement, 28, 350, 50, 50); // 在刚刚裁剪的园上画图
                    ctx.restore(); // 还原状态
                    ctx.font = "16px PingFang-SC-Medium";
                }
                ctx.fillText(this.daily.nick, 85, 375);
                ctx.drawImage(codeElement, bgwidth * 0.7, 335, 75, 75); //添加二维码图片
                setTimeout(() => {
                    document.getElementById('qrcode').src = canvas.toDataURL("image/jpg");
                    canvas.style.display = 'none'
                }, 1000);
            }
        },
        showWeekFirstDay: function() {
            // 获取签到详情
            this.data = []
            this.axios.get('/wechatauth/signlog/week').then(res => {
                if (res.data.result) {
                    this.haveCheck = res.data.datas
                        // console.log('数据', this.haveCheck)
                    this.PunchTime = this.haveCheck.length
                } else {
                    this.haveCheck = []
                    this.PunchTime = 0
                }
                // if (this.haveCheck && this.haveCheck.length > 0) {
                var Nowdate = new Date();
                var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
                var Month = Number(WeekFirstDay.getMonth()) + 1
                    //获取当前时间
                var currentdate = Nowdate.getDate();
                if (currentdate >= 0 && currentdate <= 9) {
                    currentdate = "0" + currentdate;
                }
                this.haveCheck.every(element => {
                    if (Number(element.createdAt.split(" ")[0].substring(8, 10)) === Number(currentdate)) {
                        this.status = false
                        return false;
                    } else {
                        this.status = true
                        return true;
                    }
                });
                if (WeekFirstDay.getDate() >= 1 && WeekFirstDay.getDate() <= 9) {
                    var day = "0" + WeekFirstDay.getDate();
                } else {
                    var day = WeekFirstDay.getDate();
                }
                // var currentWeekLastDay = new Date(Nowdate.getTime() + (86400000 * 6));获取最后一天日期
                // console.log('星期日', currentWeekLastDay)
                // return WeekFirstDay.getYear() + "-" + M + "-" + WeekFirstDay.getDate();
                // console.log('时间', Month + "-" + day)
                if (Month === 1) {
                    this.zn_Month = '一月'
                    this.en_Month = 'January'
                } else if (Month === 2) {
                    this.zn_Month = '二月'
                    this.en_Month = 'February'
                } else if (Month === 3) {
                    this.zn_Month = '三月'
                    this.en_Month = 'March'
                } else if (Month === 4) {
                    this.zn_Month = '四月'
                    this.en_Month = 'April'
                } else if (Month === 5) {
                    this.zn_Month = '五月'
                    this.en_Month = 'May'
                } else if (Month === 6) {
                    this.zn_Month = '六月'
                    this.en_Month = 'June'
                } else if (Month === 7) {
                    this.zn_Month = '七月'
                    this.en_Month = 'July'
                } else if (Month === 8) {
                    this.zn_Month = '八月'
                    this.en_Month = 'August'
                } else if (Month === 9) {
                    this.zn_Month = '九月'
                    this.en_Month = 'September'
                } else if (Month === 10) {
                    this.zn_Month = '十月'
                    this.en_Month = 'October'
                } else if (Month === 11) {
                    this.zn_Month = '十一月'
                    this.en_Month = 'November'
                } else if (Month === 12) {
                    this.zn_Month = '十二月'
                    this.en_Month = 'December'
                }
                for (var i = 1; i <= 7; i++) {
                    //格式化下一天，拼凑日期
                    var nextDay = new Date(WeekFirstDay.getTime() + (86400000 * (i - 1)));
                    if (nextDay.getDate() >= 1 && nextDay.getDate() <= 9) {
                        var theNextDay = "0" + nextDay.getDate();
                    } else {
                        var theNextDay = nextDay.getDate();
                    }

                    if (i === 1) {
                        this.bigData = '一'
                    } else if (i === 2) {
                        this.bigData = '二'
                    } else if (i === 3) {
                        this.bigData = '三'
                    } else if (i === 4) {
                        this.bigData = '四'
                    } else if (i === 5) {
                        this.bigData = '五'
                    } else if (i === 6) {
                        this.bigData = '六'
                    } else if (i === 7) {
                        this.bigData = '日'
                    }
                    this.data.push({
                        time: this.bigData,
                        checked: false,
                        number: theNextDay,
                    })

                }
                this.data.forEach(val => {
                        this.haveCheck.forEach(element => {
                            if (Number(val.number) === Number(element.createdAt.split(" ")[0].substring(8, 10))) {
                                val.checked = true
                            } else {

                            }
                        });

                    })
                    // }

                // console.log('截取的时间', e.createdAt.split(" ")[0].substring(8, 10))
                // if (Number(e.createdAt.split(" ")[0].substring(8, 10)) === Number(day + i - 1)) {
                //     this.isCheck = true
                //     console.log('相等的有', e.createdAt.split(" ")[0].substring(8, 10))
                //     console.log('相等的判断', this.isCheck)
                // } else {
                //     this.isCheck = false
                // }
            });



        },
        changType(type) {
            this.type = type;
            // console.log(this.type);
        },

        changeStatus() {
            var Nowdate = new Date();
            var currentdate = Nowdate.getDate();
            if (currentdate >= 0 && currentdate <= 9) {
                currentdate = "0" + currentdate;
            }
            this.axios.get('/wechatauth/signlog/insert').then(res => {
                    if (res.data.result) {
                        this.data.forEach(val => {
                            if (Number(val.number) === Number(currentdate)) {
                                val.checked = true
                            } else {

                            }
                        })
                        this.status = false;
                        this.$dialog.toast({ mes: '打卡成功', timeout: 3000 });
                        this.PunchTime = this.PunchTime + 1;
                        this.isShowDay = true
                        this.getDaily()
                    } else {
                        this.$dialog.toast({ mes: res.data.message, timeout: 3000 });
                    }
                })
                // console.log(this.status)

        }

    },

}