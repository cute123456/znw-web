import Router from 'vue-router'
import index from './'
import learn from './learn'
import articledetail from './articledetail'
import understand from './understand'
import study from './study'
import daily from './daily'
import answer from './answer'
import monthly from './monthly'

export default [{
    name: '爱学习模块',
    component: index,
    path: '/learn',
    redirect: '/learn/learn',
    children: [{
            name: '爱学习',
            path: 'learn',
            component: learn
        },
        {
            name: '文章详情',
            path: 'articledetail',
            component: articledetail
        },
        {
            name: '了解列表',
            path: 'understand',
            component: understand
        },
        {
            name: '爱学习首页',
            path: 'study',
            component: study
        },
        {
            name: '每日一题',
            path: 'daily',
            component: daily
        },
        {
            name: '每日一题答案',
            path: 'answer',
            component: answer
        },
        {
            name: '每月冲关',
            path: 'monthly',
            component: monthly
        }

    ]
}]