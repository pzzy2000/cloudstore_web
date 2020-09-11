import request from '@/utils/request'
import {switchForm} from '@/api/iunits'

export function showcharts(params) {
  return request({
    url: '/report/statistics/getReport',
    method: 'POST',
    data: switchForm(params)
  })
}

export function showPiccharts(params) {
  return request({
    url: '/report/statistics/getReportRate',
    method: 'POST',
    data: switchForm(params)
  })
}

export function showUsercharts(params) {
  return request({
    url: '/report/statistics/getUserReport',
    method: 'POST',
    data: switchForm(params)
  })
}

export function leaderReport(url, params) {
  return request({
    url: url,
    method: 'POST',
    data: switchForm(params)
  })
}
