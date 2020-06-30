import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function fetchList(params) {
  return request({
    url: '/sys/manager/user/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function updateDeleteStatus(params) {
  return request({
    url: '/sys/manager/user/delete',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getOneuser(params) {//获取单个用户
  return request({
    url: '/sys/manager/user/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function submitUser(params) {//保存用户
  return request({
    url: '',
    method: 'POST',
    data: switchForm(params)
  })
}
