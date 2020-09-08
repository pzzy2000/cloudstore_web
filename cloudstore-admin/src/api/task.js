import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function fetchList(params) {
  return request({
    url: '/task/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function planSave(params) {
  return request({
    url: '/task/save',
    method: 'POST',
    data: switchForm(params)
  })
}

export function planStart(params) {
  return request({
    url: '/task/start',
    method: 'POST',
    data: switchForm(params)
  })
}
