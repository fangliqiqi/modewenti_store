import request from '@/utils/request'


/**
 * 获取用户抽奖次数
 */
export function getDrawnum( data) {
  return request({
    url: '/shop-api/admin/ebUserLuckDrawFrequency/queryListPage',
    method: 'get',
    params:data
  })
}
/**
 * 获取用户抽奖次数详情
 */
export function getDrawdetail(id) {
  return request({
    url: '/shop-api/admin/ebUserLuckDrawFrequency/queryDetail/'+id,
    method: 'POST',
    // data
  })
}
/**
 * 修改用户抽奖次数
 */
export function updateDraw( data) {
  return request({
    url: '/shop-api/admin/ebUserLuckDrawFrequency/add',
    method: 'POST',
    data
  })
}

/**
 * 抽奖次数记录
 */
export function queryListPage( data) {
  return request({
    url: '/shop-api/admin/ebUserLuckDrawFrequencyRecord/queryListPage',
    method: 'get',
    params:data
  })
}

/**
 * 抽奖商品列表
 */
export function drawStorelist( data) {
  return request({
    url: '/shop-api/admin/ebUserLuckDraw/queryListPage',
    method: 'get',
    params:data
  })
}
/**
 * 抽奖商品详情
 */
export function drawStoredetail( data) {
  return request({
    url: '/shop-api/admin/ebUserLuckDraw/queryDetail',
    method: 'post',
    data
  })
}
/**
 * 抽奖商品添加
 */
export function drawStoreadd( data) {
  return request({
    url: '/shop-api/admin/ebUserLuckDraw/add',
    method: 'post',
    data
  })
}
/**
 * 抽奖商品删除
 */
export function drawStoredelete(data) {
  return request({
    url: '/shop-api/admin/ebUserLuckDraw/delete',
    params:data
  })
}
/**
 * 抽奖商品修改
 */
export function drawStoreupdate( data) {
  return request({
    url: '/shop-api/admin/ebUserLuckDraw/update',
    method: 'post',
    data
  })
}

/**
 * 抽奖记录
 */
export function drawRecord( data) {
  return request({
    url: '/shop-api/admin/ebUserLuckDrawRecord/queryListPage',
    method: 'get',
    params:data
  })
}

/**
 * 中奖记录
 */
export function luckRecord( data) {
  return request({
    url: '/shop-api/admin/ebUserWinningPrizeRecord/queryListPage',
    method: 'get',
    params:data
  })
}
