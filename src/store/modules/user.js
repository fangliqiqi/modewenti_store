import { login, logout, getInfo,getAuthCode,getShopInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { isLoginApi } from '@/api/sms'
import Cookies from 'js-cookie'
import { oAuth, getQueryString } from "@/libs/wechat";

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  isLogin: Cookies.get('isLogin'),
  shopId:''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ISLOGIN: (state, isLogin) => {
    state.isLogin = isLogin
    Cookies.set(isLogin)
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SHOP_ID:(state,shopId) =>{
    state.shopId = shopId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      // login( userInfo ).then(data => {
      //   commit('SET_TOKEN', data.token)
      //   Cookies.set('JavaInfo', JSON.stringify(data))
      //   setToken(data.token)
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
      login(userInfo).then(res => {
        commit('SET_TOKEN', res)
        // Cookies.set('JavaInfo', JSON.stringify(res))
        setToken(res);
        resolve(res)
      }).catch(error => {
        reject(error)
      })
      // getAuthCode(userInfo).then(response=>{
      //
      // }).catch(error=>{
      //   reject(error)
      // })
    })
  },

  // 短信是否登录
  isLogin({ commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      isLoginApi().then(async res => {
        commit('SET_ISLOGIN', res.status)
        resolve(res)
      }).catch(res => {
        commit('SET_ISLOGIN', false)
        reject(res)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    console.info(state)
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(data => {
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roleIds, account } = data

        // roles must be a non-empty array
        if (!roleIds || roleIds.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        delete data.resourceUrls
        let userinfo = JSON.stringify(data);
        Cookies.set('JavaInfo', userinfo)
        commit('SET_ROLES', roleIds)
        // commit('SET_ROLES', ['admin'])
        commit('SET_NAME', account)
        // commit('SET_AVATAR', avatar)
        commit('SET_AVATAR', 'http://kaifa.crmeb.net/system/images/admin_logo.png')
        commit('SET_INTRODUCTION', 'CRMEB admin')
        getShopInfo().then(shopId=>{
          commit('SET_SHOP_ID', shopId)
          resolve(data)
        }).catch(error=>{
          reject(error)
        })

      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      let data = {
        "clientId": 0,
        "code": "",
        "redirectUrl": "",
        token:state.token
      }
      logout(data).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        localStorage.clear();
        Cookies.remove('storeStaffList')
        Cookies.remove('JavaInfo')
        sessionStorage.removeItem('token')
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  // 设置token
  setToken({commit},state) {
    return new Promise(resolve => {
      commit('SET_TOKEN', state.token)
      Cookies.set('JavaInfo', JSON.stringify(state))
      setToken(data.token)
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
