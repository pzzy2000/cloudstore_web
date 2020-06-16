import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'

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

export function saveSupplierInfo(baseInfo,blicense) {
  return request({
    url: '/sys/supplier/saveSupplierShop',
    method: 'POST',
    data: saveSupplier(baseInfo,blicense)
  })
}
