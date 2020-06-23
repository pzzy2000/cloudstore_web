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
