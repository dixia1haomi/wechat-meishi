import { Config } from './Config.js'
import { Token } from './Token.js'


class Base {
  constructor() {
  }

  // 请求基类
  request(params, noRefetch) {
    let that = this
    wx.request({
      url: Config.url + params.url,
      method: 'POST',
      data: params.data,
      header: {
        'content-type': 'application/json',
        'token_key': wx.getStorageSync('token_key')
      },
      success(res) {
        if (res.statusCode === 200) {
          params.sCallback && params.sCallback(res.data)
        } else {
          console.log('Base基类请求失败，statusCode不等于200', res)
          // *看服务器返回的code是多少，在处理
          // *
          // 请求接口失败重试
          if (!noRefetch) { that._refetch(params) }
        }
      },
      fail(err) { console.log('Base基类请求失败,进入fail') }
    })
  }

  // 请求接口失败重试
  _refetch(params) {
    let token = new Token();
    token.getToken((back) => {
      this.request(params, true);
    });
  }


  // ----------------------------------------------------------授权------------------------------------------------------------

  // --------授权用户信息-userinfo------
  authorize_userinfo(callBack) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() { callBack && callBack(true) },
            fail() {
              wx.openSetting({ success: (res) => { if (res.authSetting['scope.userInfo']) { callBack && callBack(true) } } })
            }
          })
        } else { callBack && callBack(true) }
      }
    })
  }
}

export { Base }