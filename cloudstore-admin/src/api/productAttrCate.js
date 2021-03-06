import request from '@/utils/request'
import {switchForm} from '@/api/iunits'
export function fetchList(params) {
  return request({
    url:'/goods/property/list',
    method:'post',
    data:switchForm(params)
  })
}

export function createProductAttrCate(params) {
  return request({
    url:'/goods/property/save',
    method:'post',
    data:switchForm(params)
  })
}

export function deleteProductAttrCate(params) {
  return request({
    url:'/goods/property/delete',
    method:'post',
    data:switchForm(params)
  })
}

export function updateProductAttrCate(params) {
  return request({
    url:'/goods/property/save',
    method:'post',
    data:switchForm(params)
  })
}
export function fetchListWithAttr() {
  return request({
    url:'/productAttribute/category/list/withAttr',
    method:'get'
  })
}

export function getAttributetypes(params) {
  return request({
    url: '/goods/property/select',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getCommodityspecification(params) {
  return request({
    url: '/goods/property/param/list',
    method: 'POST',
    data: switchForm(params)
  })
}
