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
