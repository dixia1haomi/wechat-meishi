import { Token } from './utils/Token.js'
const token = new Token()

App({

  onLaunch: function () {
    // 小程序初始化检查token
    this.wx_checkToken()
  },

  onError: function (msg) {
    console.log('触发APP——onError',msg)
  },


  // 小程序初始化检查token
  wx_checkToken() {
    let token_key = wx.getStorageSync('token_key')
    //用户可能第一次来，缓存中没有token
    if (!token_key) {
      console.log('我要去获取token')
      this.getToken()   // 获取token
    } else {
      // 去服务器检查token
      console.log('我要去检查token')
      this.checkToken(token_key)
    }
  },

  // 去服务器获取token
  getToken() {
    token.getToken(back => {
      console.log('获取token成功并缓存', back.data.token_key)
      wx.setStorageSync('token_key', back.data.token_key)
    })
  },

  // 去服务器检查token,如果失效,调用获取token
  checkToken(token_key) {
    token.checkToken(token_key, back => {
      // console.log('checkToken', back.data.isValid)
      if (back.data.isValid) {
        console.log('服务器token还有效')
      } else {
        console.log('服务器token已失效,重新请求')
        this.getToken()
      }
    })
  }


})