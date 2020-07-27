import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function fetchList(params) {
	  return request({
	    url: '/activity/list',
	    method: 'POST',
	    data: switchForm(params)
	  })
	}

export function fetchActivityGoodsList(params) {
	  return request({
	    url: '/activity/goods/list',
	    method: 'POST',
	    data: switchForm(params)
	  })
	}
  export function delActivityGoodsList(params) {
  	  return request({
  	    url: '/activity/goods/delete',
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

export function changeShowidx(params) {
  return request({
    url: '/activity/updateIndexStatus',
    method: 'POST',
    data: switchForm(params)
  })
}

export function delActivity(params) {
  return request({
    url: '/activity/delete',
    method: 'POST',
    data: switchForm(params)
  })
}

export function showInnavigate(params) {
  return request({
    url: '/activity/updateNavigateStatus',
    method: 'POST',
    data: switchForm(params)
  })
}

export function onoffAct(params) {
  return request({
    url: '/activity/updateStatus',
    method: "POST",
    data: switchForm(params)
  })
}

export function fetchListWithChildren(params) {
  return request({
    url:'/goods/category/getGoodsCateByParId?parentId='+params,
    method:'get',
  })
}
