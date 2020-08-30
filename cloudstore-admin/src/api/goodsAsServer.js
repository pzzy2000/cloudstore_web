import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function getAslist(params) {
  return request({
    url: '/goods/return/rules/list',
    method: 'POST'
  })
}

export function getRulesInfo(params) {
  return request({
    url: '/goods/return/rules/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function saveRule(params) {
  return request({
    url: '/goods/return/rules/save',
    method: 'POST',
    data: switchForm(params)
  })
}

export function updateRule(params) {
  return request({
    url: '/goods/return/rules/save',
    method: 'POST',
    data: switchForm(params)
  })
}

export function deleteRule(params) {
  return request({
    url: '/goods/return/rules/delete',
    method: 'POST',
    data: switchForm(params)
  })
}
