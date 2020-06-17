import request from '@/utils/request'
import {switchForm} from '@/api/iunits'
export function fetchList(params) {
  return request({
    url:'/goods/property/param/list',
    method:'post',
    data:switchForm(params)
  })
}

export function deleteProductAttr(data) {
  return request({
    url:'/productAttribute/delete',
    method:'post',
    data:data
  })
}

export function createProductAttr(data) {
  return request({
    url:'/goods/property/param/save',
    method:'post',
    data:switchForm(data)
  })
}

export function updateProductAttr(id,data) {
  return request({
    url:'/productAttribute/update/'+id,
    method:'post',
    data:data
  })
}
export function getProductAttr(id) {
  return request({
    url:'/productAttribute/'+id,
    method:'get'
  })
}

export function getProductAttrInfo(productCategoryId) {
  return request({
    url:'/productAttribute/attrInfo/'+productCategoryId,
    method:'get'
  })
}
