/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const drawluckRouter = {
  path: '/drawLuck',
  component: Layout,
  redirect: '/drawLuck/draw',
  name: 'drawLuck',
  meta: {
    title: '抽奖管理',
    icon: 'clipboard'
  },
  children: [
    {
      path: '/numList/index',
      component: () => import('@/views/drawLuck/numList/index'),
      name: 'numList',
      meta: { title: '抽奖次数记录', icon: '' },
    },
    {
      path: '/drawNum/index',
      component: () => import('@/views/drawLuck/drawNum/index'),
      name: 'drawNum',
      meta: { title: '用户抽奖次数', icon: '' },
    },
    {
      path: 'drawStore',
      name: 'storelist',
      component: () => import('@/views/drawLuck/drawStore/index'),
      meta: { title: '抽奖商品', icon: '' },
      children: [
        {
          path: 'storelist',
          component: () => import('@/views/drawLuck/drawStore/storelist/index'),
          name: 'storelist',
          meta: { title: '抽奖商品列表', icon: '',noCache: true,
            activeMenu: `drawLuck/drawStore/storelist/index` ,
            }
        },
        {
          path: 'addStore/:name?/:id?',
          component: () => import('@/views/drawLuck/drawStore/storelist/addStore'),
          name: 'addStore',
          meta: { title: '抽奖商品', icon: '',noCache: true,
            activeMenu: `drawStore/storelist/index` ,
            }
        },
      ]
    },
    {
      path: '/drawRecord/index',
      component: () => import('@/views/drawLuck/drawRecord/index'),
      name: 'drawRecord',
      meta: { title: '抽奖记录', icon: '' },
    },
    {
      path: '/luckRecord/index',
      component: () => import('@/views/drawLuck/luckRecord/index'),
      name: 'luckRecord',
      meta: { title: '中奖记录', icon: '' },
    },

  ]
}

export default drawluckRouter
