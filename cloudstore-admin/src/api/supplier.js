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
