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
