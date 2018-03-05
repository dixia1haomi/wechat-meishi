import { Config } from './Config.js'

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
        console.log('base', res)
        if (res.statusCode == 200) {
          // 成功
          if (res.data.errorCode == 0) {
            params.sCallback && params.sCallback(res.data)
          }
          // Token类错误，40000
          else if (res.data.errorCode == 40000 && !noRefetch) {
            that._refetch(params)
          }
          // errorCode不等于0，* 错误页并记录日志
          else {
            wx.navigateTo({ url: '/pages/exception/exception?code=' + 'errorCode不等于0' })
          }
        } else {
          console.log('Base基类请求失败，statusCode不等于200', res)
          // statusCode不等于200,可能是请求成功，但是出现了错误
          wx.navigateTo({ url: '/pages/exception/exception?code=' + 'statusCode不等于200' })
        }

      },
      fail(err) {
        // 提示-请检查网络状态-重试(*)
        console.log('Base基类请求失败,进入fail')
        wx.navigateTo({ url: '/pages/exception/exception?code=' + 'basefail' })
      }
    })
  }

  // 请求接口失败重试
  _refetch(params) {
    getApp().newGetToken((back) => {
      this.request(params, true);
    });
  }


  // ----------------------------------------------------------授权------------------------------------------------------------




  // -------------------------------------------------------------------------------------------------------------------------



  // --------授权用户信息-userinfo------
  authorize_userinfo(callBack) {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          console.log('base-没有授权用户信息')
          wx.openSetting({ success: (res) => { if (res.authSetting['scope.userInfo']) { callBack && callBack(true) } } })
        } else {
          callBack && callBack(true)
        }
      },
      fail: (err) => {
        console.log('base-授权用户信息进入fail', err)
        wx.showToast({ title: '微信授权失败' })
      }
    })
  }

  // -------- 授权地理位置 ---------
  authorize_userLocation(callBack) {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation']) {
          console.log('base-没有授权地理位置')
          wx.openSetting({ success: (res) => { if (res.authSetting['scope.userLocation']) { callBack && callBack(true) } } })
        } else {
          callBack && callBack(true)
        }
      },
      fail: (err) => {
        console.log('base-授权地理位置进入fail', err)
        wx.showToast({ title: '微信授权失败' })
      }
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

}

export { Base }



  // 用户授权
  // scope.userInfo	wx.getUserInfo	用户信息
  // scope.userLocation	wx.getLocation, wx.chooseLocation	地理位置
  // scope.address	wx.chooseAddress	通讯地址
  // scope.invoiceTitle	wx.chooseInvoiceTitle	发票抬头
  // scope.werun	wx.getWeRunData	微信运动步数
  // scope.record	wx.startRecord	录音功能
  // scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
  // scope.camera		摄像头