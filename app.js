import { Token } from './utils/Token.js'
import { Api } from './utils/Api.js'
const api = new Api()
const token = new Token()

App({

  appData: {
    // 地理位置是否授权标识位
    userLocation: false,
    longitude: null,   // 用户经度
    latitude: null,    // 用户纬度
  },

  onLaunch: function (op) {
    console.log('app op', op.path)
    // 检查来源（可能分享自餐厅详情，要显示一个返回主页按钮）
    if (op.path == "pages/canting/detail") { this.appData.path = true }
    // 数据请求(餐厅list)
    // this._load()
    // 小程序初始化检查token
    this.wx_checkToken()
    // 获取地理位置
    // this.zuobiao()
    this._check_userLocation()

    // 获取设备信息
    this.getSysInfo()
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
      }
    })
  },

  // --------------------------------------------------数据请求(餐厅list)--------------------------------------------

  _load(callback) {

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
      console.log('获取token成功并缓存', back)
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