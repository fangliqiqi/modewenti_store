import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import SettingMer from '@/utils/settingMer'
import { isPhone } from "@/libs/wechat";
// create an axios instance
const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if(SettingMer.appId){
      config.headers['X-Auth-AppId'] = SettingMer.appId;
    }
    // do something before request is sent
    const token = !store.getters.token?sessionStorage.getItem('token'):store.getters.token;
    if (token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situationf
      config.headers['Authorization'] = token
    }
    if(/get/i.test(config.method)){
      config.params = config.params || {}
      config.params.temp= Date.parse(new Date()) / 1000
      if(store.getters.shopId)
      config.params.branchId = store.getters.shopId || ''
    }else{
      config.data = config.data || {}
      if(store.getters.shopId){
        config.data.branchId = store.getters.shopId || '';
        if(config.params){
          config.params.branchId = store.getters.shopId || ''
        }
      }

    }
    console.info(config)
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 401) {
      // to re-login
      MessageBox.confirm('您已经登出，您可以取消停留在这个页面，或重新登录', '退出', {
        confirmButtonText: '或重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    }
    if (res.code !== 200  && res.code !== 401) {
      if (isPhone()) { //移动端
        return Promise.reject(res || 'Error')
      }
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // return Promise.reject(new Error(res.message || 'Error'))
    } else {
      console.info(res)
      return res.data
    }
  },
  error => {
    let {code,message} = error.response.data
    console.info(code,message)
    Message({
      message: message||error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
