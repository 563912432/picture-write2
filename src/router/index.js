import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Detail from '@/components/detail'
import introduce from '@/components/introduce'
import adDetail from '@/components/adDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/d/:id',
      name: 'd',
      component: Detail
    },
    {
      path: '/introduce/:url',
      name: '/introduce',
      component: introduce
    },
    {
      path: '/adDetail/:type',
      name: '/adDetail',
      component: adDetail
    }
  ]
})
