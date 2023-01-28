import request from '@/utils/request'

// 登陆
export function getAuthCode(data) {
  return request({
    url: '/auth-api/auth/accessCode',
    method: 'post',
    data: data
  })
}
// 登录方法
export function login(data) {
  return request({
    url: '/auth-api/app/mdwtMallLogin',
    method: 'post',
    data:data
  })
}

// 获取用户详细信息
export function getInfo(token) {
  return request({
    url: '/system-api/system/getUserInfo',
    method: 'get',
    params:{ token }
  })
}

// 获取用户详细信息
export function getShopInfo() {
  return request({
    url: '/store-api/branchInfo/getBranchinfoId',
    method: 'post',
  })
}


// export function login(data) {
//   return request({
//     url: '/admin/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/admin/getAdminInfoByToken',
//     method: 'get',
//     params: { token }
//   })
// }

export function logout(data) {
  return request({
    url: '/auth-api/app/mdwtMallDropOut',
    method: 'get',
    params:data
  })
}

/**
 * 会员管理 列表
 * @param pram
 */
export function userListApi(params) {
  return request({
    url: `/shop-api/admin/user/list`,
    method: 'get',
    params
  })
}

/**
 * 会员管理 修改
 * @param pram
 */
export function userUpdateApi(params, data) {
  return request({
    url: `/shop-api/admin/user/update`,
    method: 'post',
    params,
    data
  })
}

/**
 * 会员管理 详情
 * @param pram
 */
export function userInfoApi(params) {
  return request({
    url: `/shop-api/admin/user/info`,
    method: 'get',
    params
  })
}

/**
 * 会员管理 账户详情
 * @param pram
 */
export function infobyconditionApi(params) {
  return request({
    url: `/shop-api/admin/user/infobycondition`,
    method: 'get',
    params
  })
}

/**
 * 会员管理 账户详情top数据
 * @param pram
 */
export function topdetailApi(params) {
  return request({
    url: `/shop-api/admin/user/topdetail`,
    method: 'get',
    params
  })
}

/**
 * 会员管理 批量设置分组
 * @param pram
 */
export function groupPiApi(params) {
  return request({
    url: `/shop-api/admin/user/group`,
    method: 'post',
    params
  })
}

/**
 * 会员管理 批量设置标签
 * @param pram
 */
export function tagPiApi(params) {
  return request({
    url: `/shop-api/admin/user/tag`,
    method: 'post',
    params
  })
}

/**
 * 会员管理 积分余额
 * @param pram
 */
export function foundsApi(params) {
  return request({
    url: `/shop-api/admin/user/operate/founds`,
    method: 'get',
    params
  })
}

/**
 * 会员管理 删除
 * @param pram
 */
export function userDeleteApi(params) {
  return request({
    url: `/shop-api/admin/user/delete`,
    method: 'get',
    params
  })
}

/**
 * 会员等级 列表
 * @param pram
 */
export function levelListApi(params) {
  return request({
    url: `/shop-api/admin/system/user/level/list`,
    method: 'get',
    params
  })
}

/**
 * 会员等级 新增
 * @param pram
 */
export function levelSaveApi(data) {
  return request({
    url: `/shop-api/admin/system/user/level/save`,
    method: 'post',
    data
  })
}

/**
 * 会员等级 编辑
 * @param pram
 */
export function levelUpdateApi(params, data) {
  return request({
    url: `/shop-api/admin/system/user/level/update`,
    method: 'post',
    params,
    data
  })
}

/**
 * 会员等级 详情
 * @param pram
 */
export function levelInfoApi(params) {
  return request({
    url: `/shop-api/admin/system/user/level/info`,
    method: 'get',
    params
  })
}

/**
 * 会员等级 删除
 * @param pram
 */
export function levelDeleteApi(params) {
  return request({
    url: `/shop-api/admin/system/user/level/delete`,
    method: 'get',
    params
  })
}

/**
 * 会员等级 是否显示
 * @param pram
 */
export function levelUseApi(params) {
  return request({
    url: `/shop-api/admin/system/user/level/use`,
    method: 'get',
    params
  })
}

/**
 * 会员标签 列表
 * @param pram
 */
export function tagListApi(params) {
  return request({
    url: `/shop-api/admin/user/tag/list`,
    method: 'get',
    params
  })
}

/**
 * 会员标签 新增
 * @param pram
 */
export function tagSaveApi(data) {
  return request({
    url: `/shop-api/admin/user/tag/save`,
    method: 'post',
    data
  })
}

/**
 * 会员标签 编辑
 * @param pram
 */
export function tagUpdateApi(params, data) {
  return request({
    url: `/shop-api/admin/user/tag/update`,
    method: 'post',
    params,
    data
  })
}

/**
 * 会员标签 详情
 * @param pram
 */
export function tagInfoApi(params) {
  return request({
    url: `/shop-api/admin/user/tag/info`,
    method: 'get',
    params
  })
}

/**
 * 会员标签 删除
 * @param pram
 */
export function tagDeleteApi(params) {
  return request({
    url: `/shop-api/admin/user/tag/delete`,
    method: 'get',
    params
  })
}

/**
 * 会员分组 列表
 * @param pram
 */
export function groupListApi(params) {
  return request({
    url: `/shop-api/admin/user/group/list`,
    method: 'get',
    params
  })
}

/**
 * 会员分组 新增
 * @param pram
 */
export function groupSaveApi(data) {
  return request({
    url: `/shop-api/admin/user/group/save`,
    method: 'post',
    data
  })
}

/**
 * 会员分组 编辑
 * @param pram
 */
export function groupUpdateApi(params, data) {
  return request({
    url: `/shop-api/admin/user/group/update`,
    method: 'post',
    params,
    data
  })
}

/**
 * 会员分组 详情
 * @param pram
 */
export function groupInfoApi(params) {
  return request({
    url: `/shop-api/admin/user/group/info`,
    method: 'get',
    params
  })
}

/**
 * 会员分组 删除
 * @param pram
 */
export function groupDeleteApi(params) {
  return request({
    url: `/shop-api/admin/user/group/delete`,
    method: 'get',
    params
  })
}

/**
 *获取登录页图片
 */
export function getLoginPicApi() {
  return request({
    url: '/auth-api/sms/getVerifyCodeFactory',
    method: 'get'
  })
}

/**
 * @description 验证码
 */
export function captchaApi() {
  return request({
    url: '/auth-api/sms/getVerifyCodeFactory',
    method: 'get'
  })
}
