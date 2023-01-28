import request from '@/utils/request'

export function systemConfigCheck(pram) {
  const data = {
    name: pram.name
  }
  return request({
    url: '/shop-api/admin/system/config/check',
    method: 'GET',
    params: data
  })
}

export function systemConfigInfo(pram) {
  const data = {
    formId: pram.id
  }
  return request({
    url: '/shop-api/admin/system/config/info',
    method: 'GET',
    params: data
  })
}

export function systemConfigSave(pram) {
  return request({
    url: '/shop-api/admin/system/config/save/form',
    method: 'POST',
    data: pram
  })
}


/**
 * 文件上传
 * @param data
 */
export function fileFileApi(data, params) {
  return request({
    url: '/shop-api/admin/upload/file',
    method: 'POST',
    params,
    data
  })
}

/**
 * 图片上传
 * @param data
 */
export function fileImageApi(data, params) {
  return request({
    url: '/shop-api/admin/upload/image',
    method: 'POST',
    params,
    data
  })
}

/**
 * 图片列表
 * @param data
 */
export function fileListApi(params) {
  return request({
    url: '/shop-api/admin/system/attachment/list',
    method: 'get',
    params
  })
}

/**
 * 图片列表 删除图片
 * @param data
 */
export function fileDeleteApi(id) {
  return request({
    url: `/shop-api/admin/system/attachment/delete/${id}`,
    method: 'get'
  })
}

/**
 * 图片列表 移動分類
 * @param data
 */
export function attachmentMoveApi(data) {
  return request({
    url: `/shop-api/admin/system/attachment/move`,
    method: 'post',
    data
  })
}


/**
 * 微信上传图片
 * @param data
 */
export function wechatUploadApi(data, params) {
  return request({
    url: `/shop-api/admin/wechat/media/upload`,
    method: 'post',
    data,
    params
  })
}
