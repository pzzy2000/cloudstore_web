import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import store from '../store'
import {
  getToken
} from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 ,// 请求超时时间
  minioUploadUrl:process.env.BASE_API+"/sys/upload/entity/image/update"
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
//    console.log(">>>>>>>>>>>>>>>>>>   request拦截器  " + getToken());
    config.headers['auth'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data
    // if (res.result.code !== 200)
    if (res.result.code !== 0) {
      Message({
        message: res.result.msg,
        type: 'error',
        duration: 3 * 1000
      })

      // 401:未登录;
      if (res.result.code == -2) {
        MessageBox.confirm('登录失效', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      // return Promise.reject('error')
       return response.data;
    } else {
      // Message({
      //   message: "www",
      //   type: 'info',
      //   duration: 3 * 1000
      // })
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
