import Layout from '@/layout'

const storeRouter = {
    path: '/shop',
    component: Layout,
    redirect: '/shop/index',
    name: 'Shop',
    meta: {
      title: '门店',
      icon: 'clipboard'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/shop/index'),
        name: 'ShopIndex',
        meta: { title: '门店信息', icon: '' }
      },
      {
        path: 'apply',
        component: () => import('@/views/shop/apply/index'),
        name: 'applyIndex',
        meta: { title: '门店申请列表', icon: '' }
      },
      {
        path: 'list',
        component: () => import('@/views/shop/list/index'),
        name: 'ShopIndex',
        meta: { title: '门店列表', icon: '' },
      },
      {
        path: 'creatShop/:id?',
        component: () => import('@/views/shop/creatShop/index'),
        name: 'creatShop',
        meta: { title: '编辑门店', icon: '' },
      }

    ]
  }

export default storeRouter
