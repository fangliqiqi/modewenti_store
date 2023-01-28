import Layout from '@/layout'

const cardRouter = {
  path: '/cardVolume',
  component: Layout,
  redirect: '/cardVolume/index',
  name: 'cardVolume',
  meta: {
    title: '卡券',
    icon: 'clipboard'
  },
  children: [
    {
      path: '/cardVolumelist/index',
      component: () => import('@/views/cardVolume/cardVolumelist/index'),
      name: 'cardVolumelist',
      meta: { title: '卡券列表', icon: '' }
    },
    {
      path: '/cardBusiness/index',
      component: () => import('@/views/cardVolume/cardBusiness/index'),
      name: 'cardBusiness',
      meta: { title: '卡券业务项', icon: '' }
    },
    {
      path: '/cardBuylist/index',
      component: () => import('@/views/cardVolume/cardBuylist/index'),
      name: 'cardBuylist',
      meta: { title: '卡券购买记录', icon: '' }
    },
    {
      path: '/cardCancel/index',
      component: () => import('@/views/cardVolume/cardCancel/index'),
      name: 'cardCancel',
      meta: { title: '卡券激活记录', icon: '' }
    }
  ]
}

export default cardRouter
