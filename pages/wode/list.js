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
    // userinfo: null,
  },


  onLoad: function (op) {
    // 进入时判断用户是否有info缓存，没有则显示登陆按钮
    this._load()
  },

  // 登陆
  _load() {
    // 取缓存
    let info = wx.getStorageSync('userinfo')
    if (info) { this.setData({ userinfo: info, loginState: true }) }
  },

  // 登陆按钮
  _login() { app.newGetToken(back => { this._load() }) },

  // 我的收藏
  go_shoucang() {
    // 跳转到收藏页 -> 获取收藏缓存数组(里面是餐厅ID) -> 查询数据库
    wx.navigateTo({ url: '/pages/wode/shoucang' })
  },

  // 我的留言
  go_liuyan(e) {
    // 是否登陆过 ？ 跳转到我的留言页 ： 调用登陆
    app.appData.LoginState ? wx.navigateTo({ url: '/pages/wode/liuyan' }) : app.newGetToken(back => { this.go_liuyan() })
  },

  // 关于我
  go_guanyuwo() { wx.navigateTo({ url: '/pages/wode/guanyuwo' }) }
})