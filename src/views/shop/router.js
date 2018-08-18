import Router from 'vue-router'
import index from './'
import classify from './classify';
import list from './list';
import detail from './detail';
import cart from './cart';
import settlement from './settlement';
export default [{
    name: '商城模块',
    component: index,
    path: '/shop',
    redirect: '/shop/classify',
    children: [{
            name: '商品分类',
            path: 'classify',
            component: classify,
            meta: {
                auth: true
            }
        },
        {
            name: '商品列表页',
            path: 'list',
            component: list,
            meta: {
                auth: true
            }
        },
        {
            name: '商品详情页',
            path: 'detail',
            component: detail,
            meta: {
                auth: true
            }
        },
        {
            name: '购物车',
            path: 'cart',
            component: cart,
            meta: {
                auth: true
            }
        },
        {
            name: '结算页面',
            path: 'settlement',
            component: settlement,
            meta: {
                auth: true
            }
        },
    ]
}]