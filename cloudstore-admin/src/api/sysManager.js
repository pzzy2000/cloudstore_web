import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function getUserlist(params) {
  return request({
    url: '/com/manager/user/list',
    method: "POST",
    data: switchForm(params)
  })
}

export function adduser(params) {
  return request({
    url: '/com/manager/user/save',
    method: "POST",
    data: switchForm(params)
  })
}

export function getAnuser(params) {
  return request({
    url: '/com/manager/user/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function upduser(params) {
  return request({
    url: '/com/manager/user/save',
    method: 'POST',
    data: switchForm(params)
  })
}

export function deluser(params) {
  return request({
    url: '/com/manager/user/delete',
    method: 'POST',
    data: switchForm(params)
  })
}

export function powerList(params) {
  return request({
    url: '/sys/role/module/comManageList',
    method: 'POST',
    data: switchForm(params)
  })
}

export function isLink(params) {
  return request({
    url: '/com/module/relation/save',
    method: 'POST',
    data: switchForm(params)
  })
}

export function isUnlink(params) {
  return request({
    url: '/com/module/relation/remove',
    method: 'POST',
    data: switchForm(params)
  })
}
