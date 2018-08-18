import Router from 'vue-router'
import index from './'
import sport from './sport'
import bet from './bet'
import detail from './sportdetail'
// import understand from './understand'
// import signUp from './signUp'
// import donation from './donation'

export default [{
    name: '爱运动模块',
    component: index,
    path: '/sport',
    redirect: '/sport/sport',
    children: [{
            name: '爱运动',
            path: 'sport',
            component: sport
        },
        {
            name: '有奖竞猜',
            path: 'bet',
            component: bet
        },
        {
            name: '资讯详情',
            path: 'detail',
            component: detail
        }
        // {
        //     name: '了解列表',
        //     path: 'understand',
        //     component: understand
        // },
        // {
        //     name: '我要报名',
        //     path: 'signUp',
        //     component: signUp,
        //     meta: {
        //         bind: true
        //     }
        // },
        // {
        //     name: '我要助力',
        //     path: 'donation',
        //     component: donation,
        //     meta: {
        //         bind: true
        //     }
        // }

    ]
}]