import request from '@/utils/request'

export function groupDelete(pram) {
  const data = {
    id: pram.id
  }
  return request({
    url: '/shop-api/admin/system/group/delete',
    method: 'GET',
    params: data
  })
}

export function groupInfo(pram) {
  const data = {
    id: pram.id
  }
  return request({
    url: '/shop-api/admin/system/group/info',
    method: 'GET',
    params: data
  })
}

export function groupList(pram) {
  const data = {
    keywords: pram.keywords,
    pageNo: pram.pageNo,
    pageSize: pram.pageSize
  }
  return request({
    url: '/shop-api/admin/system/group/list',
    method: 'GET',
    params: data
  })
}

export function groupSave(pram) {
  const data = {
    formId: pram.formId,
    info: pram.info,
    name: pram.name
  }
  return request({
    url: '/shop-api/admin/system/group/save',
    method: 'POST',
    params: data
  })
}

export function groupEdit(pram) {
  const data = {
    formId: pram.formId,
    info: pram.info,
    name: pram.name,
    id: pram.id
  }
  return request({
    url: '/shop-api/admin/system/group/update',
    method: 'POST',
    params: data
  })
}
