import request from '@/utils/request'
import {switchForm,saveSupplier} from '@/api/iunits'
// export function fetchList(params) {
//   return request({
//     url:'/order/list',
//     method:'get',
//     params:params
//   })
// }
//
// export function closeOrder(params) {
//   return request({
//     url:'/order/update/close',
//     method:'post',
//     params:params
//   })
// }
//
// export function deleteOrder(params) {
//   return request({
//     url:'/order/delete',
//     method:'post',
//     params:params
//   })
// }
//
// export function deliveryOrder(data) {
//   return request({
//     url:'/order/update/delivery',
//     method:'post',
//     data:data
//   });
// }
//
// export function getOrderDetail(id) {
//   return request({
//     url:'/order/'+id,
//     method:'get'
//   });
// }
//
// export function updateReceiverInfo(data) {
//   return request({
//     url:'/order/update/receiverInfo',
//     method:'post',
//     data:data
//   });
// }
//
// export function updateMoneyInfo(data) {
//   return request({
//     url:'/order/update/moneyInfo',
//     method:'post',
//     data:data
//   });
// }
//
// export function updateOrderNote(params) {
//   return request({
//     url:'/order/update/note',
//     method:'post',
//     params:params
//   })
// }
export function fetchList(params) {
  return request({
    url: '/order/list',
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
