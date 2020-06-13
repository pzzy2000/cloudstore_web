import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function fetchList(params) {
  return request({
    url: '/sys/manager/user/list',
    method: 'POST',
    data: switchForm(params)
  })
}
