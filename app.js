import { Token } from './utils/Token.js'
import { Api } from './utils/Api.js'
const api = new Api()
const token = new Token()

App({

  appData: {
    // 地理位置是否授权标识位
    userLocation: false,
    longitude: null,     // 用户经度
    latitude: null,      // 用户纬度
    LoginState: false,   // 登陆状态
    path: false          // 是否来自餐厅详情页
  },

  onLaunch: function (op) {
    console.log('app op', op.path)
    // 检查来源（可能分享自餐厅详情，要显示一个返回主页按钮）
    if (op.path == "pages/canting/detail") { this.appData.path = true }

    // 小程序初始化检查token
    this.wx_checkToken(back => {
      // 设置用户登陆状态
      this.setLoginState()
    })
    
    // 获取地理位置
    this._check_userLocation()

    // 获取设备信息
    this.getSysInfo()

    // -----
    console.log(this.appData)
  },

  onError: function (msg) {
    console.log('触发APP——onError', msg)
  },



  // --------------------------------------------------获取设备信息--------------------------------------------
  // 获取设备信息
  getSysInfo() {
    wx.getSystemInfo({
      success: (res) => {
        console.log('获取设备信息', res)
        console.log('屏幕宽', res.windowWidth)
        this.appData.sysWidth = res.windowWidth
        console.log('屏幕高', res.windowHeight)
        this.appData.sysHeight = res.windowHeight
        console.log('屏幕总高', res.screenHeight)
        this.appData.screenHeight = res.screenHeight
      },
      fail: (err) => {
        console.log('获取设备信息进入fail', err)
      }
    })
  },


  // -------------------------------------------------- 检查地理位置授权 -----------------------------------------------------

  _check_userLocation() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          console.log('检查地理位置-已授权', res)
          // 获取坐标
          wx.getLocation({
            type: 'gcj02',
            success: (res) => {
              console.log('app-获取用户坐标', res)
              this.appData.longitude = res.longitude
              this.appData.latitude = res.latitude
              this.appData.userLocation = true
            },
            fail: (err) => { console.log('app-获取用户坐标进入fail', err) }
          })

        } else {
          console.log('检查地理位置-未授权', res)
          this.appData.userLocation = false
        }
      },
      fail: (err) => { console.log('base-授权地理位置进入fail', err) }
    })
  },
  // 获取地理位置
  // zuobiao() {
  //   wx.getLocation({
  //     // type: 'wgs84',
  //     success: (res) => {
  //       console.log('app-获取地理位置',res)
  //       this.appData.longitude = res.longitude
  //       this.appData.latitude = res.latitude
  //     }
  //   })
  // },

  // ---------------------------------------------------Token-----------------------------------------------------
  // 小程序初始化检查token
  wx_checkToken(callback) {
    let token_key = wx.getStorageSync('token_key')
    //用户可能第一次来，缓存中没有token
    if (!token_key) {
      console.log('我要去获取token')
      this.getToken(back => { back && callback(true) })   // 获取token
    } else {
      // 去服务器检查token
      console.log('我要去检查token')
      this.checkToken(token_key, back => { back && callback(true) })
    }
  },

  // 去服务器获取token
  getToken(callback) {
    token.getToken(back => {
      console.log('获取token成功并缓存', back)
      wx.setStorageSync('token_key', back.data.token_key)
      callback && callback(true)
    })
  },

  // 去服务器检查token,如果失效,调用获取token
  checkToken(token_key, callback) {
    token.checkToken(token_key, back => {
      // console.log('checkToken', back.data.isValid)
      if (back.data.isValid) {
        console.log('服务器token还有效')
        callback && callback(true)
      } else {
        console.log('服务器token已失效,重新请求')
        this.getToken(back => { back && callback(true) })
      }
    })
  },


  // ----------------------------- 设置用户登陆状态 -------------------------------------
  setLoginState() {
    // 检查数据库
    api.uidCheckInfo({}, res => {
      console.log('uidCheckInfo', res)
      if (res.errorCode == 0) {
        // 检查userinfo授权
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userInfo']) { this.appData.LoginState = true }
          },
          fail: (err) => {
            console.log('检查userinfo授权进入fail', err)
          }
        })
      }
    })
  }

})