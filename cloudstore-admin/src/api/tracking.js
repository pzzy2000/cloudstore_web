import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function fetchList(params) {
  return request({
    url: '/sys/tracking/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function addlogis(params) {
  return request({
    url: '/sys/tracking/save',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getOnelogis(params) {
  return request({
    url: '/sys/tracking/list',
    method: 'POST',
    data: switchForm(params)
  })
}
