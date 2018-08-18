import Router from 'vue-router'
import index from './'
import item from './item'
import itemDetail from './itemDetail'
import activityDetail from './activityDetail'
import signUp from './signUp'
import donation from './donation'

export default [{
    name: '公益模块',
    component: index,
    path: '/welfare',
    redirect: '/welfare/item',
    children: [
        {
            name: '公益列表',
            path: 'item',
            component: item
        },
        {
            name: '公益详情',
            path: 'itemDetail',
            component: itemDetail
            
        },
        {
            name: '活动详情',
            path: 'activityDetail',
            component: activityDetail
        },
        {
            name: '我要报名',
            path: 'signUp',
            component: signUp,
            meta: {
                bind: true
            }
        },
        {
            name: '我要助力',
            path: 'donation',
            component: donation,
            meta: {
                bind: true
            }
        }
        
    ]
}]