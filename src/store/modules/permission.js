import { asyncRoutes, constantRoutes } from '@/router'
import * as categoryApi from '@/api/categoryApi.js'
import * as roleApi from '@/api/roleApi.js'
import * as Auth from '@/libs/wechat';
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    let tmp = { ...route }
    // if (hasPermission(roles, tmp)) {
    if (tmp.children) {
      tmp.child = filterAsyncRoutes(tmp.children, roles)
    }
    res.push(tmp)
    // }
  })

  return res
  // let res = []
  // for(let i=0; i< menuData.length; i++){
  //   let menu = menuData[i]
  //   res.push(...routes.filter(route => {
  //     return menu === route.name
  //   }))
  // }
  // return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ADD_ROUTES: (state, routes) => {
    state.addRoutes = routes
  },
  SET_ROUTES:(state, routes)=>{
    state.routes = routes
  }
}

const actions = {
  generateRoutes({ commit }, roleid) {
    return new Promise(async resolve => {
      let accessedRoutes = []
      let menus= []
      // const { rules } = await roleApi.getRoleById(roleid)
      // const menus = await categoryApi.categroyByIds({ ids: rules })
      menus = await roleApi.menuListApi()
      // !Auth.isPhone() ? menus = menusAll.filter(item => item.url !== '/javaMobile') : menus = menusAll.filter(item => item.url === '/javaMobile')
      const _routerResult = comRouter(menus, asyncRoutes)
      accessedRoutes = filterAsyncRoutes(_routerResult, [])
      // todo 这里控制是否过滤路由，经测试有些菜单不能予以设置，比如系统设置等等
      commit('SET_ADD_ROUTES', menus)
      // resolve(menus)
      commit('SET_ROUTES', filterAsyncRoutes(menus, []))
      resolve(accessedRoutes)

      // commit('SET_ROUTES', asyncRoutes)
      // resolve(asyncRoutes)
    })
  }
}

function comRouter(menus, asyncRouter, hasLeft) {
  const res = []
  asyncRouter.forEach(router => {
    const _leftUrl = hasLeft ? (hasLeft + '/' + router.path) : router.path
    const _hasPromise = menus.filter(item => item.url.startsWith(_leftUrl))
    if (_hasPromise.length > 0) {
      res.push(router)
    }
    if (router.children) {
      comRouter(menus, router.children, router.path)
    }
  })
  return res
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}