import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'


export function fetchList(params) {
  return request({
    url: '/agent/list',
    method: 'POST',
    data: switchForm(params)
  })
}
