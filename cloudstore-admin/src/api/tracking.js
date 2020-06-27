import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function fetchList(params) {
  return request({
    url: '/activity/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function addActivity(params) {
  return request({
    url: '/activity/save',
    method: 'POST',
    data: switchForm(params)
  })
}

export function addlogis(params) {
  return request({
    url: '/sys/tracking/save',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getOnelogis(params) {
  return request({
    url: '/sys/tracking/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getLogistics(params) {
  return request({
    url: '/sys/tracking/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function deleteLogis(params) {
  return request({
    url: '/sys/tracking/delete',
    method: 'POST',
    data: switchForm(params)
  })
}

export function fetchAllgoods(params) {
  return request({
    url: '/activity/goods/getStatusActivityGoods',
    method: 'POST',
    data: switchForm(params)
  })
}

export function delOneactivity(params) {
  return request({
    url: '/activity/goods/delete',
    method: 'POST',
    data: switchForm(params)
  })
}

export function inAssogoods(params) {
  return request({
    url: '/activity/goods/save',
    method: 'POST',
    data: switchForm(params)
  })
}

export function outAssogoods(params) {
  return request({
    url: '/activity/goods/delete',
    method: 'POST',
    data: switchForm(params)
  })
}

export function searchLogis(params) {
  return request({
    url: '/sys/tracking/list',
    method: 'POST',
    data: switchForm(params)
  })
}
