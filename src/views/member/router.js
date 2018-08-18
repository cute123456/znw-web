import Router from 'vue-router'
import index from './'
import center from './center'
import personal from './personal'
import sign from './sign'
import membership from './membership'
import opinion from './opinion'
import bind from './bind'
import qrcode from './qrcode'
import record from './record'
import redeem from './redeem'
import aboutUs from './aboutUs'
import integral from './integral'
import method from './method'
import collectlist from './collectlist'
import malllist from './malllist'
import confirm from './confirm'
import manageAddress from './manageAddress'
import addAddress from './addAddress'
import editAddress from './editAddress'
import medal from './medal'
import travelRecords from './travelRecords'
import friend from './friend';


export default [{
    name: '我的',
    component: index,
    path: '/member',
    redirect: '/member/personal',
    children: [{
            name: '个人中心',
            path: 'center',
            component: center,
            meta: {
                auth: true
            }
        },
        {
            name: '个人中心2',
            path: 'personal',
            component: personal,
            meta: {
                auth: true
            }
        },
        {
            name: '签到主页',
            path: 'sign',
            component: sign,
            meta: {
                auth: true
            }
        },
        {
            name: '会员信息',
            path: 'membership',
            component: membership,
            meta: {
                auth: true
            }
        },
        {
            name: '意见反馈',
            path: 'opinion',
            component: opinion,
            meta: {
                auth: true
            }
        },
        {
            name: '绑定手机号码',
            path: 'bind',
            component: bind,
            meta: {
                auth: true
            }
        },
        {
            name: '我的推广二维码',
            path: 'qrcode',
            component: qrcode,
            meta: {
                auth: true
            }
        },
        {
            name: '公益记录',
            path: 'record',
            component: record,
            meta: {
                auth: true
            }
        },
        {
            name: '兑换创客币',
            path: 'redeem',
            component: redeem,
            meta: {
                auth: true
            }
        },
        {
            name: '关于我们',
            path: 'aboutUs',
            component: aboutUs,
            meta: {
                auth: true
            }
        },
        {
            name: '积分',
            path: 'integral',
            component: integral,
            meta: {
                auth: true
            }
        },
        {
            name: '积分使用获取方法',
            path: 'method',
            component: method,
            meta: {
                auth: true
            }
        },
        {
            name: '好友列表',
            path: 'friend',
            component: friend,
            meta: {
                auth: true
            }
        },
        {
            name: '收藏列表',
            path: 'collectlist',
            component: collectlist,
            meta: {
                auth: true
            }
        },
        {
            name: '积分商城',
            path: 'malllist',
            component: malllist,
            meta: {
                auth: true
            }
        },
        {
            name: '确认订单',
            path: 'confirm',
            component: confirm,
            meta: {
                auth: true
            }
        },
        {
            name: '管理地址',
            path: 'manageAddress',
            component: manageAddress,
            meta: {
                auth: true
            }
        },
        {
            name: '添加地址',
            path: 'addAddress',
            component: addAddress,
            meta: {
                auth: true
            }
        },
        {
            name: '编辑地址',
            path: 'editAddress',
            component: editAddress,
            meta: {
                auth: true
            }
        },
        {
            name: '勋章墙',
            path: 'medal',
            component: medal,
            meta: {
                auth: true
            }
        },
        {
            name: '旅游记录',
            path: 'travelRecords',
            component: travelRecords,
            meta: {
                auth: true
            }
        }


    ]
}]