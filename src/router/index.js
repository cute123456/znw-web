import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home'
import school from '@/views/school'
import member from '@/views/member/router.js'
import welfare from '@/views/welfare/router.js'
import notFound from '@/views/notFound'
import shop from '@/views/shop/router.js'
import learn from '@/views/learn/router.js'
import sport from '@/views/sport/router.js'
import travel from '@/views/travel/router.js'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            name: 'home',
            component: home,
            meta: {
                auth: true
            }
        },
        {
            path: '/school',
            name: 'school',
            component: school,
            meta: {
                auth: true
            }
        },
        {
            path: '*',
            component: notFound,
        },
        ...member,
        ...welfare,
        ...shop,
        ...learn,
        ...sport,
        ...travel
    ],
    mode: 'history'
})