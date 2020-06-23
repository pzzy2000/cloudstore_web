import request from '@/utils/request'
import {switchForm} from '@/api/iunits'


export function updateGoodsAttr(params) {

  return request({
    url:'/goods/sku/goodsSkuList',
    method:'POST',
    data:params
  })
}


export function fetchList(params) {

  return request({
    url:'/goods/list',
    method:'POST',
    data:switchForm(params)
  })
}

export function fetchSimpleList(params) {
  return request({
    url:'/product/simpleList',
    method:'get',
    params:params
  })
}

export function updateDeleteStatus(params) {
  return request({
    url:'/product/update/deleteStatus',
    method:'post',
    params:params
  })
}

export function updateNewStatus(params) {
  return request({
    url:'/product/update/newStatus',
    method:'post',
    params:params
  })
}

export function updateRecommendStatus(params) {
  return request({
    url:'/product/update/recommendStatus',
    method:'post',
    params:params
  })
}

export function updatePublishStatus(params) {
  return request({
    url:'/product/update/publishStatus',
    method:'post',
    params:params
  })
}

export function createProduct(params) {
  return request({
    url:'/goods/save?optType=save',
    method:'post',
    data:switchForm(params)
  })
}

export function getProduct(params) {
  return request({
    url:'/goods/get',
    method:'post',
    data:switchForm(params)
  })
}


export function updateProduct(id,data) {
  return request({
    url:'/product/update/'+id,
    method:'post',
    data:data
  })
}
