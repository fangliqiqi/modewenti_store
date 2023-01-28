import request from '@/utils/request'

/**
 * 门店列表
 * @param pram
 */
export function shopListPageApi(data) {
  return request({
    url: '/store-api/branchInfo/queryListPage',
    method: 'POST',
    data:data
  })
}
//新增(会员注册门店)
export function addShopApi(data) {
  return request({
    url:'/store-api/branchInfo/RegisterStores',
    method:'POST',
    data:data
  })
}

//新增(会员注册门店)
export function updateShopApi(data) {
  return request({
    url:'/store-api/branchInfo/update',
    method:'POST',
    data:data
  })
}


//审核门店信息通过
export function passShopApi(data) {
  return request({
    url:'/store-api/branchInfo/checkPass',
    method:'get',
    params:data
  })
}

//审核门店信息驳回
export function rejShopApi(data) {
  return request({
    url:'/store-api/branchInfo/checkReject',
    method:'get',
    params:data
  })
}

//激活门店
export function activeShopApi(data) {
  return request({
    url:'/store-api/branchInfo/activation',
    method:'get',
    params:data
  })
}

//冻结门店
export function freezeShopApi(data) {
  return request({
    url:'/store-api/branchInfo/freeze',
    method:'get',
    params:data
  })
}

//删除门店信息
export function delShopApi(data) {
  return request({
    url:'/store-api/branchInfo/delete',
    method:'post',
    data:data
  })
}

//获取门店信息
export function getShopInfoApi(data) {
  return request({
    url:'/store-api/branchInfo/getBranchInfoResult',
    method:'get',
    params:{id:data}
  })
}

//获取申请列表
export function getShopApply(data) {
  return request({
    url:'/store-api/branchApplication/queryListPage',
    method:'post',
    data
  })
}
