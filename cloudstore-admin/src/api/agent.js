import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'

export function fetchList(params){
    return request({
      url:'/agent/list',
      method:'post',
     data: switchForm(params)
    })
}
export function getAgentInfo(params){
    return request({
      url:'/agent/get',
      method:'post',
     data: switchForm(params)
    })
}

export function getOneagent(params) {
  return request({
    url: '/agent/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function saveUpdateLevel(params) {
  return request({
    url: '/agent/level/save',
    method: 'POST',
    data: switchForm(params)
  })
}

export function delAgent(params) {
  return request({
    url: '/agent/delete',
    method: 'POST',
    params: params
  })
}

export function getOnelevel(params) {
  return request({
    url: '/agent/level/get',
    method: 'POST',
    data: switchForm(params)
  })
}
