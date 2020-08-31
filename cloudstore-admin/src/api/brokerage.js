import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'

export function getActlist(params) {
  return request ({
    url: '/activity/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getGoodslist(params) {
  return request ({
    url: '/finance/profit/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getSkulist(params) {
  return request ({
    url: '/finance/profit/goods/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getdefbroke(params) {
  return request ({
    url: '/finance/profit/defaults/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function listUserBroke(params) {
  return request ({
    url: '/finance/sumlist',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getUserinfo(params) {
  return request ({
    url: '/finance/alllistByUserId',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getBrokeinfo(params) {
  return request ({
    url: '/finance/profit/detail/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function updateBrosku(params) {
  return request({
    url: '/finance/profit/goods/update',
    method: 'POST',
    data: params
  })
}

export function fetchListWithChildren(params) {
  return request({
    url:'/goods/category/getGoodsCateByParId?parentId='+params,
    method:'get',
  })
}

export function fetchList(params) {
  return request({
    url:'/goods/list',
    method:'POST',
    data:switchForm(params)
  })
}

export function getgoodsSku(params) {
  return request({
    url: '/finance/profit/goods/detail/list',
    method: 'post',
    data: switchForm(params)
  })
}

export function saveSetting(params) {
  return request({
    url: '/finance/profit/goods/detail/save',
    method: 'post',
    data: params
  })
}

export function settingDef(params) {
  return request({
    url: '/finance/profit/defaults/save',
    method: 'POST',
    data: switchForm(params)
  })
}
