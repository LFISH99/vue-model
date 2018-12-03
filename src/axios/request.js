import axios from 'axios'
import qs from 'qs'
import API from './api'
import {
  WEB_CONFIG,
  NETWORK
} from './config'

// import store from '../store'
// import router from '@/router'

const HOME_HOST = document.location.origin

// 创建实例
let instance = axios.create({
  baseURL: ''
  // ...
})

// 正在请求中的队列
let penddingList = {}
let CancelToken = axios.CancelToken
const cancelType = {
  get: 1,
  unwait: 1,
  post: 2,
  wait: 2,
  none: 0
}

// 请求方法集合
const requestMethod = {
  post: (url, data = {}, config, eventType) => {
    return instance.post(url, qs.stringify(data), config).then(res => {
      delete penddingList[eventType]

      if (res.data && res.status === 200) {
        return Promise.resolve(res.data, NETWORK)
      }
      throw res
    }).catch(error => {
      console.warn(error)
      return Promise.reject(error)
    })
  },
  get: (url, data = {}, config, eventType) => {
    config.params = data

    return instance.get(url, config).then(res => {
      delete penddingList[eventType]

      if (res.data && res.status === 200) {
        return Promise.resolve(res.data, NETWORK)
      }
      throw res
    }).catch(error => {
      console.warn(error)
      return Promise.reject(error)
    })
  }
}

/**
 * @param {String} eventType      请求名称
 * @param {Object} data           请求数据
 * @param {Object} config         自定义请求配置
 * @param {Boolean} showLoading   是否显示loading图标，默认不显示
 */
const request = (eventType, data = {}, config = {}, showLoading = false) => {
  let _api = API[eventType]

  if (!_api) return Promise.reject(new Error(`request-event: ${eventType} doesn't exist.`))

  if (typeof config === 'boolean') {
    showLoading = config
    config = {}
  }

  let user = 'user' // 获取用户信息
  let cfg = _api(data, user) // 获取对应请求相关数据

  // region 处理请求取消方式
  let _cancelType = cancelType[cfg.type || cfg.method]
  let cancel = penddingList[eventType]

  if (_cancelType !== 0 && cancel) {
    if (_cancelType === 1) {
      cancel()
      // cancel(eventType + ' request is cancelled.')
      delete penddingList[eventType]
    } else {
      return Promise.resolve({
        code: -999,
        msg: 'The previous request is active.'
      })
    }
  }
  // endregion

  let axiosConfig = {
    cancelToken: new CancelToken(c => { penddingList[eventType] = c }),
    ...config
  }

  // 处理请求使用了moke方式
  if (WEB_CONFIG.moke === -1 || (WEB_CONFIG.moke === 0 && WEB_CONFIG.mokeList.indexOf(eventType) !== -1)) {
    axiosConfig.baseURL = HOME_HOST
    cfg.url = WEB_CONFIG.mokePath + eventType + 'json'
    cfg.method = 'get'
  }

  let fetch = requestMethod[cfg.method]

  if (!cfg.url) return Promise.reject(new Error('request-url is empty'))
  if (!fetch) return Promise.reject(new Error('request-method is error'))

  return fetch(cfg.url, cfg.data, axiosConfig, eventType, showLoading)
}

export default request
