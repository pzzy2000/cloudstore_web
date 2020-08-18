import request from '@/utils/request'
import {switchForm} from '@/api/iunits'
export function submitPics(params) {
  return request({
    url: "/manager/sys/hotsale/pice/save",
    method: "POST",
    data: switchForm(params)
  })
}

export function getSlidelist() {
  return request({
    url: '/manager/sys/hotsale/pice/list',
    method: 'POST'
  })
}

export function getActiveList() {
  return request({
    url: '/activity/listAll',
    method: 'POST'
  })
}

export function getInfo(params) {
  return request({
    url: '/manager/sys/hotsale/pice/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function delSlide(params) {
  return request({
    url: '/manager/sys/hotsale/pice/delete',
    method: 'POST',
    data: switchForm(params)
  })
}
