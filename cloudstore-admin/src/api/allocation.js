import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function fetchList(params) {
  return request({
    url:'/order/allocation/list',
    method:'POST',
    data:switchForm(params)
  })
}

export function fetchDetailList(params) {
  return request({
    url:'/order/allocation/detail/list',
    method:'POST',
    data:switchForm(params)
  })
}
