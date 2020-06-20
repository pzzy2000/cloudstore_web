import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function fetchList(params) {
  return request({
    url: '/sys/dict/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function get(params) {
  return request({
    url: '/sys/dict/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function saveUpate(params) {
  return request({
    url: '/sys/dict/save',
    method: 'POST',
    data: switchForm(params)
  })
}
