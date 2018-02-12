import { Base } from '../../utils/Base.js'
import { Api } from '../../utils/Api.js'

const api = new Api()
const base = new Base()

const app = getApp()

Page({

  data: {
    // 登陆按钮状态
    loginState: false,
    // 用户信息
    userInfo: null,
  },


  onLoad: function (op) {
    // 取缓存
    let info = wx.getStorageSync('userinfo')
    if (info) {
      this.setData({ userInfo: info, loginState: true })
    }
  },


  // 登陆
  _login() {
    if (app.appData.LoginState) {
      this.setData({ loginState: true, userInfo: wx.getStorageSync('userinfo') })
    } else {
      // 调用base用户授权
      base.login(back => { this._login() })
    }
  },

  // 我的话题
  go_huati() {
    if (app.appData.LoginState) {
      wx.navigateTo({ url: '/pages/wode/huati' })
    } else {
      // 调用base用户授权
      base.login(back => { this.go_huati() })
    }
  },

  // 我的收藏
  go_shoucang() {
    // 跳转到收藏页 -> 获取收藏缓存数组(里面是餐厅ID) -> 查询数据库
    wx.navigateTo({ url: '/pages/wode/shoucang' })
  },

  // 我的留言
  go_liuyan() {
    if (app.appData.LoginState) {
      wx.navigateTo({ url: '/pages/wode/liuyan' })
    } else {
      // 调用base用户授权
      base.login(back => { this.go_liuyan() })
    }
  },

  // 关于我
  go_guanyuwo() {
    wx.navigateTo({ url: '/pages/wode/guanyuwo' })
  }
})