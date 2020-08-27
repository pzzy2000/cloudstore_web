import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

//线下活动列表
export function fetchList(params) {
  return request({
    url: '/activity/list',
    method: 'POST',
    data: switchForm(params)
  })
}
