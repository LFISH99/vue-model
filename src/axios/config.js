const RUN_ENV = 'dev'

// const SERVER_PROT = document.location.protocol + '//'

/**
 * host: 服务器地址
 * moke:
 *    -1: 所有请求使用moke数据
 *     0: 部分请求使用moke数据，mokeList生效
 *     1: 关闭moke
 * mokePath: moke存放路径
 * mokeList: 使用moke数据的API名
 * debug:
 */
const envConfig = {
  'dev': {
    host: '',
    moke: 1,
    mokePath: './static/moke/',
    mokeList: [],
    debug: true
  },
  'test': {
    host: '',
    moke: 1,
    mokePath: './static/moke/',
    mokeList: [],
    debug: true
  },
  'production': {
    host: '',
    moke: 1,
    mokePath: './static/moke/',
    mokeList: [],
    debug: false
  }
}

const WEB_CONFIG = envConfig[RUN_ENV]

// 状态码
const NETWORK = {
  requestOK: '000000'
  // ...
}

export {
  WEB_CONFIG,
  NETWORK
}
