import { Config } from './Config.js'


class Token {
  constructor() {

  }

  // 获取token
  // getToken(callback) {
  //   wx.login({
  //     success(res) {
  //       wx.request({
  //         url: Config.url + 'token/gettoken',
  //         method: 'POST',
  //         data: { code: res.code },
  //         success(res) {
  //           if (res.statusCode === 200 && res.data.errorCode == 0) {
  //             wx.setStorageSync('token_key', res.data.data)
  //             callback && callback(res)
  //           } else {
  //             console.log('请求Code不等于200,Token类.gettoken', res)
  //             wx.navigateTo({ url: '/pages/exception/exception' })
  //           }
  //         },
  //         fail: (err) => {
  //           console.log('Token类.gettoken进入fail', err)
  //         }
  //       })
  //     }
  //   })
  // }



  // 检查token是否有效
  // checkToken(token_key, callback) {
  //   wx.request({
  //     url: Config.url + 'token/verify',
  //     method: 'POST',
  //     data: { token: token_key },
  //     success(res) {
  //       if (res.statusCode === 200) { callback && callback(res) } else { console.log('请求Code不等于200,Token类.checkToken', res) }
  //     },
  //     fail: (err) => {
  //       console.log('Token类.检查token是否有效进入fail', err)
  //     }
  //   })
  // }
}

export { Token }