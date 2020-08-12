import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function fetchAgentList(params) {
  return request({
    url:'/order/allocation/agent/list',
    method:'POST',
    data:switchForm(params)
  })
}

export function fetchKdList(params) {
  return request({
    url:'/order/allocation/kd/list',
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
export function peisong(params) {
  return request({
    url: '/order/delivery/order',
    method: 'POST',
    params: params
  })
}
