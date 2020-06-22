import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'

export function fetchList(params){
    return request({
      url:'/agent/level/list',
      method:'post',
     data: switchForm(params)
    })
}

export function saveUpdateLevel(params){
    return request({
      url:'/agent/level/save',
      method:'post',
     data: switchForm(params)
    })
}
