export function fetchList(url, params) {
  return request({
    url: url,
    method: 'POST',
    params: params
  })
}
