import { Api } from './utils/Api.js'
import { Base } from './utils/Base.js'

const base = new Base()
const api = new Api()


App({

  appData: {
    LoginState: false,   // 登陆状态
    LocationState: false,// 地理位置是否授权标识位
    longitude: null,     // 用户经度
    latitude: null,      // 用户纬度
    // userinfo: null,      // 用户信息
    path: false,         // 是否来自餐厅详情页
  },

  // 用户授权
  // scope.userInfo	wx.getUserInfo	用户信息
  // scope.userLocation	wx.getLocation, wx.chooseLocation	地理位置
  // scope.address	wx.chooseAddress	通讯地址
  // scope.invoiceTitle	wx.chooseInvoiceTitle	发票抬头
  // scope.werun	wx.getWeRunData	微信运动步数
  // scope.record	wx.startRecord	录音功能
  // scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
  // scope.camera		摄像头
  // authSetting: {

  // },

  onLaunch: function (op) {
    console.log('app op', op.path)
    // 检查来源（可能分享自餐厅详情，要显示一个返回主页按钮）
    if (op.path == "pages/canting/detail") { this.appData.path = true }

    // 小程序初始化检查token
    this.checkToken()

    // 获取地理位置
    // this._check_userLocation()

    // 获取设备信息
    this.getSysInfo()

    // console.log(this.appData)

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

  // -------------------------------------------- 检查用户授权(app.js初始化调用) --------------------------------------------
  // check_authSetting(callback) {
  //   wx.getSetting({
  //     success: res => {
  //       console.log('getSetting-succ', res.authSetting)
  //       this.authSetting = res.authSetting
  //       callback && callback()
  //     },
  //     fail: err => { console.log('getSetting-fail', err) }
  //   })
  // },

  // -------------------------------------------------- 地理位置授权 -----------------------------------------------------

  // _check_userLocation() {
  //   wx.getSetting({
  //     success: (res) => {
  //       if (res.authSetting['scope.userLocation']) {
  //         console.log('检查地理位置-已授权', res)
  //         // 获取坐标
  //         wx.getLocation({
  //           type: 'gcj02',
  //           success: (res) => {
  //             console.log('app-获取用户坐标', res)
  //             this.appData.userLocation = true
  //             this.appData.longitude = res.longitude
  //             this.appData.latitude = res.latitude
  //           },
  //           fail: (err) => { console.log('app-获取用户坐标进入fail', err) }
  //         })

  //       } else {
  //         console.log('检查地理位置-未授权', res)
  //         // this.appData.userLocation = false
  //       }
  //     },
  //     fail: (err) => { console.log('app.js-_check_userLocation-检查地理位置进入fail', err) }
  //   })
  // },


  // 获取地理位置（餐厅详情页调用）
  getLocation(callback) {
    wx.getLocation({
      // type: 'wgs84',
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: (res) => {
        console.log('app-获取地理位置', res)
        this.appData.longitude = res.longitude
        this.appData.latitude = res.latitude
        this.appData.LocationState = true
        callback && callback()
      }
    })
  },

  // ---------------------------------------------------Token-----------------------------------------------------
  // 小程序初始化检查token
  checkToken() {
    let token_key = wx.getStorageSync('token_key')
    //用户可能第一次来，缓存中没有token
    if (!token_key) {
      console.log('第一次来,我要去获取token')
      // 要求授权，同意后去服务器获取token,拒绝不管
      wx.authorize({ scope: 'scope.userInfo', success: () => { this.newGetToken() } })
    } else {
      console.log('我要去服务器检查token是否有效')
      this.service_CheckToken(token_key)
    }
  },


  // 去服务器检查token,如果失效,调用获取token
  service_CheckToken(token_key) {
    api.checkToken({ token: token_key }, back => {
      console.log('service_CheckToken', back)
      if (back) {
        console.log('服务器token还有效,设置登录态')
        // 登录态
        this.appData.LoginState = true
      } else {
        console.log('服务器token已失效,重新请求')
        this.newGetToken()
      }
    })
  },



  // 修改后的登陆
  newGetToken(callback) {
    // 调用授权
    base.authorize_userinfo(back => {
      // 正在登陆
      wx.showLoading({ title: '登陆中..', mask: true })

      wx.login({
        success: (res) => {
          console.log('code', res)
          if (res.code) {
            // 获取用户信息
            wx.getUserInfo({
              lang: "zh_CN",
              success: (info) => {
                // 登陆
                console.log('info', info)
                info.code = res.code
                // 请求服务器
                api.newLogin(info, (back) => {
                  console.log('backinfo', back)
                  // 登录态
                  this.appData.LoginState = true
                  // 缓存token
                  wx.setStorageSync('token_key', back.token)
                  // 缓存返回的info
                  wx.setStorageSync('userinfo', back.userinfo)
                  // callback
                  callback && callback()
                  // 隐藏loding
                  wx.hideLoading()
                  // 提示成功
                  wx.showToast({ title: '登陆成功', icon: 'success' })
                })
              },
              fail: (err) => {
                console.log('获取用户信息进入fail,出现了讲道理不应该出现的错误！', err)
                // *跳转错误页并提示重新登陆
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            // *跳转错误页并提示重新登陆
          }
        }
      });
    })
  }
})