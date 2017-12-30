import { Config } from './Config.js'

class Token {
  constructor() { }

  // 获取token
  getToken(callback) {
    wx.login({
      success(res) {
        wx.request({
          url: Config.url + 'token/gettoken',
          method: 'POST',
          data: { code: res.code },
          success(res) {
            if (res.statusCode === 200) { callback && callback(res) } else { console.log('请求Code不等于200,Token类.gettoken',res) }
          }
        })
      }
    })
  }

  // 检查token是否有效
  checkToken(token_key, callback) {
    wx.request({
      url: Config.url + 'token/verify',
      method: 'POST',
      data: { token: token_key },
      success(res) {
        if (res.statusCode === 200) { callback && callback(res) } else { console.log('请求Code不等于200,Token类.checkToken',res) }
      }
    })
  }
}

export { Token }