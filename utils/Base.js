import { Config } from './Config.js'
import { Token } from './Token.js'
// import { Api } from './Api.js'

// const token = new Token()
// const api = new Api()


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
        if (res.statusCode == 200) {
          // 成功
          params.sCallback && params.sCallback(res.data)
        } else {

          console.log('Base基类请求失败，statusCode不等于200', res)

          // Token错误 $Code = 10004（获取token重试1次）
          if (res.data.code == 10004 && !noRefetch) {
            that._refetch(params)
          }

          // 数据库错误 $Code = 10002
          if (res.data.code == 10002) {
            // wx.navigateTo({ url: '/pages/exception/exception?code=' + 10002 })
            params.sCallback && params.sCallback(res.data)  // 直接返回再处理
          }

          // 微信方面错误 $Code = 10003
          if (res.data.code == 10003) {
            wx.navigateTo({ url: '/pages/exception/exception?code=' + 10003 })
          }

          // 服务器未知错误 999
          if (res.data.code == 999) {
            wx.navigateTo({ url: '/pages/exception/exception?code=' + 999 })
          }

        }

      },
      fail(err) {
        // 提示-请检查网络状态-重试(*)
        console.log('Base基类请求失败,进入fail')
        wx.navigateTo({ url: '/pages/exception/exception?code=' + 'fail' })
      }
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
    console.log('base-授权用户信息')
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() { callBack && callBack(true) },
            fail() {
              wx.openSetting({ success: (res) => { if (res.authSetting['scope.userInfo']) { callBack && callBack(true) } } })
            }
          })
        } else { callBack && callBack(true) }
      },
      fail: (err) => { console.log('base-授权用户信息进入fail', err) }
    })
  }

  // -------- 授权地理位置 ---------
  authorize_userLocation(callBack) {
    console.log('base-授权地理位置')
    wx.getSetting({
      success: (res) => {
        console.log('base-授权地理位置success', res)
        if (!res.authSetting['scope.userLocation']) {
          console.log('base-授权地理位置success-if', res)
          wx.authorize({
            scope: 'scope.userLocation',
            success() { callBack && callBack(true) },
            fail() {
              wx.openSetting({ success: (res) => { if (res.authSetting['scope.userLocation']) { callBack && callBack(true) } } })
            }
          })
        } else {
          console.log('base-授权地理位置success-else', res)
          callBack && callBack(true)
        }
      },
      fail: (err) => { console.log('base-授权地理位置进入fail', err) }
    })
  }

  // --------授权保存到相册------
  authorize_writePhotosAlbum(callBack) {
    console.log('base-授权保存到相册')
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { callBack && callBack(true) },
            fail() {
              wx.openSetting({ success: (res) => { if (res.authSetting['scope.writePhotosAlbum']) { callBack && callBack(true) } } })
            }
          })
        } else { callBack && callBack(true) }
      },
      fail: (err) => { console.log('base-授权保存到相册进入fail', err) }
    })
  }

  // ---------------------------------------------------------- 登陆 ------------------------------------------------------------
  // 登陆(根据缓存是否有userInfo来判断是否登陆。tips：问题，官方登陆态？还没有研究，应该使用官方的登陆态)
  login(callback) {
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo)
    if (!userInfo) {
      console.log('缓存中没有userInfo')
      this.authorize_userinfo(res => {
        console.log('auth', res)
        if (res) {

          wx.getUserInfo({
            withCredentials: false,
            success: (res) => {
              console.log('base-login()授权并获取用户信息成功', res)
              this.request({
                url: 'user/login', data: res.userInfo, sCallback: (data) => {
                  console.log('请求user/login写入数据库并返回成功', data)
                  // 登陆成功 -》 设置缓存
                  wx.setStorageSync('userInfo', res.userInfo)
                  // 提示
                  wx.showToast({ title: '登陆成功' })
                  // 返回 true
                  callback && callback()
                }
              })
            }
          })

        }
      })
    } else {
      console.log('缓存中有userInfo,以前登陆过')
      callback && callback()
    }
  }


  // -------------------------------------------------- 储存用户坐标 -----------------------------------------------------

  /**
   * 进入 检查标识位 -> false -> 地址栏显示；授权地址位置 -> 点击(授权.包含获取坐标和设置标识位)后刷新页面获得距离
   *      点击地图 -> 检查标识位 -> false -> 授权
   * 
   * 进入app 检测是否授权过 -> 设置标识位
   */

  // 获取地理位置 -> 授权 -> 成功后存入全局（app.js-data）
  zuobiao(callback) {
    this.authorize_userLocation(res => {
      if (res) {
        wx.getLocation({
          type: 'gcj02',
          success: (res) => {
            console.log('base-zuobiao-获取用户坐标', res)
            const app = getApp()
            console.log('app', app)
            app.appData.longitude = res.longitude
            app.appData.latitude = res.latitude
            app.appData.userLocation = true
            callback && callback()
          },
          fail: (err) => { console.log('base-zuobiao-获取用户坐标进入fail', err) }
        })
      }
    })
  }



}

export { Base }