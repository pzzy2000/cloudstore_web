import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'

export function fetchList(params) {
  return request({
    url: '/sys/module/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getOneorder(params) {
  return request({
    url: '/order/details/list',
    method: 'POST',
    data: switchForm(params)
  })
}
