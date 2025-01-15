/**
 * 封装axios请求方法
 */
import { Notification } from 'element-ui'
import store from '@/store/index.js'
import STATE from '@/store/States'
import LOG from '@/utils/logger'
const axios = require('axios')

const instance = axios.create({
  // baseURL: process.env.BASE_URL,
  timeout: process.env.VUE_APP_REQUEST_TIMEOUT
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 设置安全令牌
  if (config.outter !== true) {
    config.headers.authorizationCode = store.state[STATE.AUTHORIZATION_CODE] || localStorage.getItem('auth')
    config.headers.appid = 'd1f7b381-424f-4150-b763-f1a1325a1471'
  }
  // 如果未设置机构编码，则用用户当前所在机构编码
  if (!config.headers.orgCode && config.outter !== true) {
    config.headers.orgCode = store.state[STATE.USER_ORG].orgCode
  }

  if (config.method === 'get') {
    // 防止缓存
    config.params = { _t: Date.parse(new Date()), ...config.params, ...config.data }
    delete config.data
  }
  return config
})

//
instance.interceptors.response.use(
  resp => {
    let {
      data: { code }
    } = resp
    const markerable = resp.config.markerable
    if (_.isFunction(markerable)) {
      markerable(resp)
    }
    return resp
  },
  ({ message, status }) => {
    Notification.closeAll()
    if (message instanceof String) {
      if (message.indexOf('timeout') > -1) {
        Notification({
          type: 'warning',
          message: '服务端压力过大，请勿频繁操作，稍后再试！',
          position: 'bottom-right'
        })
      }
    } else if (message.indexOf('500') > -1) {
      Notification({
        type: 'warning',
        message: '服务端压力过大，请勿频繁操作，稍后再试！',
        position: 'bottom-right'
      })
    }
  }
)

export default function (ops, data) {
  if (ops === undefined || !ops.url) {
    LOG.error('请提供请求url')
    return false
  }
  const config = { baseURL: process.env.VUE_APP_BASE_URL, ...ops, data, headers: ops.headers || {} }
  if (data && data.orgCode) {
    Object.assign(config.headers, { orgCode: data.orgCode })
  }
  // 判读那ops中Content-Type存不存在
  if (ops['Content-Type']) {
    // 添加Content-Type 用来提交文件
    if (ops['Content-Type'] === 'multipart/form-data') {
      config.headers['Content-Type'] = ops['Content-Type']
    }
  } else {
    // 默认json格式
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
  }
  return instance.request(config)
}
