import request from '@/utils/request'
import {switchForm} from '@/api/iunits'
export function fetchList(url, params) {
  return request({
    url: url,
    method: 'POST',
    data: switchForm(params)
  })
}
