import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'
export function fetchList(params) {
  return request({
    url:'/goods/category/list',
    method:'post',
    data:switchForm(params)
  })
}
export function deleteProductCate(id) {
  return request({
    url:'/productCategory/delete/'+id,
    method:'post'
  })
}

export function createProductCate(data) {
  return request({
    url:'/goods/category/save',
    method:'post',
    data:switchForm(data)
  })
}

export function updateProductCate(id,data) {
  return request({
    url:'/productCategory/update/'+id,
    method:'post',
    data:data
  })
}

export function getProductCate(id) {
  return request({
    url:'/productCategory/'+id,
    method:'get',
  })
}

export function updateShowStatus(data) {
  return request({
    url:'/productCategory/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateNavStatus(data) {
  return request({
    url:'/productCategory/update/navStatus',
    method:'post',
    data:data
  })
}

export function fetchListWithChildren(params) {
  return request({
    url:'/goods/category/getGoodsCateByParId?parentId='+params,
    method:'get',
  })
}

export function savegoodLevel(url, params) {
  return request({
    url: url,
    method:'post',
    data: switchForm(params)
  })
}

export function deleteGoodlevel(url, params) {
  return request({
    url: url,
    method:'post',
    data: switchForm(params)
  })
}
