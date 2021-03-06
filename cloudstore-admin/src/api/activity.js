import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function fetchList(params) {
  return request({
    url: '/activity/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function fetchListall(params){
  return request({
    url:'/agent/allList',
    method:'post',
    data: switchForm(params)
  })
}

export function fetchListAll(params) {
  return request({
    url: '/activity/listAll',
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

export function fetchActivityGoodsLists(params) {
  return request({
    url: '/activity/goods/searchGoodsActivityOnLine',
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

export function getoneAct(params) {
  return request({
    url: '/activity/get',
    method: 'POST',
    data: switchForm(params)
  })
}

export function getoneSKU(params) {
  return request({
    url: '/finance/profit/goods/list',
    method: 'POST',
    data: switchForm(params)
  })
}

export function updateSetting(params) {
  return request({
    url: '/finance/profit/goods/updateOffline',
    method: 'POST',
    data: params
  })
}
