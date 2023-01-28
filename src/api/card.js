import request from '@/utils/request'


// 查询活动推广列表
export function listActivity(query) {
  return request({
    url: '/shop-api/admin/fouprActivity/getFouprActivityPage',
    method: 'post',
    data: query
  })
}

// 查询活动推广详细
export function getActivity(query) {
  return request({
    url: 'share/activity/getInfo',
    method: 'get',
    params: query
  })
}

// 新增活动推广
export function addActivity(data) {
  return request({
    url: '/share/activity',
    method: 'post',
    data: data
  })
}

// 修改活动推广
export function updateActivity(data) {
  return request({
    url: '/share/activity',
    method: 'put',
    data: data
  })
}

// 删除活动推广
export function delActivity(id) {
  return request({
    url: '/share/activity/' + id,
    method: 'delete'
  })
}

// 导出活动推广
export function exportActivity(query) {
  return request({
    url: '/share/activity/export',
    method: 'get',
    params: query
  })
}
// 卡券背景图

export function getCardbg(query) {
  return request({
    url: '/share/activity/cardPhotoList',
    method: 'get',
    params: query
  })
}
