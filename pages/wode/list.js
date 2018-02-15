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
    // userInfo: null,
  },


  onLoad: function (op) {
    // 取缓存
    // let info = wx.getStorageSync('userinfo')
    // if (info) {
    //   this.setData({ userInfo: info, loginState: true })
    // }

    // 进入时判断用户是否登陆过，没有则提示登陆
    this._load()
  },

  // 登陆
  _load() {
    // 获取user名下所有关联数据,包含参与的话题,留言（内部获取uid）
    if (app.appData.LoginState) {
      this.setData({ userinfo: app.appData.userinfo, loginState: true })
      // api.userAll({}, res => {
      //   console.log('userAll', res)
      //   this.setData({ Res: res, loginState: true })
      // })
    } else {
      // 调用base用户授权
      base.login(back => { this._load() })
    }

  },



  // 我的话题
  go_huati() {
    // 是否登陆过 ？ 跳转到我的话题页 ： 调用登陆
    app.appData.LoginState ? wx.navigateTo({ url: '/pages/wode/huati' }) : this._load()
  },

  // 我的收藏
  go_shoucang() {
    // 跳转到收藏页 -> 获取收藏缓存数组(里面是餐厅ID) -> 查询数据库
    wx.navigateTo({ url: '/pages/wode/shoucang' })
  },

  // 我的留言
  go_liuyan(e) {
    // 是否登陆过 ？ 跳转到我的留言页 ： 调用登陆
    app.appData.LoginState ? wx.navigateTo({ url: '/pages/wode/liuyan' }) : this._load()
  },

  // 关于我
  go_guanyuwo() { wx.navigateTo({ url: '/pages/wode/guanyuwo' }) }
})