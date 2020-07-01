import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'

export function getUserlist(params) {
  return request({
    url: '/client/register',
    method: 'POST',
    data: switchForm(params)
  })
}
