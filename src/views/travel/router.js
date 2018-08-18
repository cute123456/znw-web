import Router from 'vue-router'
import index from './'
import travel from './travel'
import lightmap from './lightmap'
import selectcity from './selectcity'
import tourism from './tourism'
import notes from './notes'
import mynotes from './mynotes'
import release from './release'
import activities from './activities'
import activityDetail from './activityDetail'
import activitySignup from './activitySignup'

export default [{
    name: '爱旅游模块',
    component: index,
    path: '/travel',
    redirect: '/travel/travel',
    children: [{
            name: '旅游文章',
            path: 'travel',
            component: travel
        },
        {
            name: '点亮地图',
            path: 'lightmap',
            component: lightmap
        },
        {
            name: '选择城市',
            path: 'selectcity',
            component: selectcity,
            meta: {
                bind: true
            }
        },
        {
            name: '爱旅游',
            path: 'tourism',
            component: tourism,
        },
        {
            name: '游记',
            path: 'notes',
            component: notes,
        },
        {
            name: '我的游记',
            path: 'mynotes',
            component: mynotes,
        },
        {
            name: '发布游记',
            path: 'release',
            component: release,
        },
        {
            name: '旅游活动',
            path: 'activities',
            component: activities,
        },
        {
            name: '旅游活动详情',
            path: 'activityDetail',
            component: activityDetail,
        },
        {
            name: '旅游活动报名',
            path: 'activitySignup',
            component: activitySignup,
        }

    ]
}]