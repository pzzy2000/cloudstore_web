import request from '@/utils/request'
import {switchForm} from '@/api/iunits'
export function submitPics(params) {
  return request({
    url: "/manager/sys/hotsale/pice/save",
    method: "POST",
    data: switchForm(params)
  })
}

export function getIndexpic() {
  return request({
    url: '/manager/sys/hotsale/pice/list',
    method: 'POST'
  })
}