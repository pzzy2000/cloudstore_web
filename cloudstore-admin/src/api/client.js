import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'

export function getUserlist(params) {
  return request({
    url: '/client/register',
    method: 'POST',
    data: switchForm(params)
  })
}

export function fetchList(params) {
  return request({
    url: '/agent/apply/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getOneapply(params) {
  return request({
    url: '/agent/apply/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function verified(params) {
  return request({
    url: '/agent/apply/checkAgent',
    method: 'POST',
    data: switchForm(params)
  })
}
