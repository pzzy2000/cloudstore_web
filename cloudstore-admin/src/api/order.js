import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'

export function fetchList(params) {
  return request({
    url: '/order/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getAgentOL(params) {
  return request({
    url: '/order/details/searchOrderDetails',
    method: 'POST',
    data: switchForm(params)
  })
}

export function oneAgentOrder(params) {
  return request({
    url: '/order/details/getOrderDetails',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getOneorder(params) {
  return request({
    url: '/order/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function afterSalelist(params) {
  return request({
    url: '/order/aftersale/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getAnorder(params) {
  return request({
    url: '/order/aftersale/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function auditStatus(params) {
  return request({
    url: '/order/aftersale/auditStatus',
    method: 'POST',
    data: switchForm(params)
  })
}

export function tuikuan(params) {
  return request({
    url: '/manage/pay/refundAfter',
    method: "POST",
    data: switchForm(params)
  })
}

export function exportExcel() {
  return request({
    url: 'order/allocation/exportExcel',
    method: 'get'
  })
}

export function exportAgentOrder(params) {
  return request({
    url: '/order/details/orderDetailsExcel',
    method: 'POST',
    data: switchForm(params)
  })
}
