import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function    searchSupplierDetail(supplierId){
  console.log(supplierId)
    return request({
      url:'/sys/supplier/searchdetail',
      method:'get',
      params:supplierId
    })
}

export function fetchList(params) {
  return request({
    url: '/sys/supplier/list',
    method: 'POST',
    data: switchForm(params)
  })
}
