import request from '@/utils/request'
import {switchSignform} from '@/api/iunits'

export function sign(params) {
  return request({
    url: '/sys/manager/platform/register/supplier',
    method: 'POST',
    data: switchSignform(params)
  })
}
