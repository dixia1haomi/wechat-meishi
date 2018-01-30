import { Base } from '../../utils/Base.js'
import { Api } from '../../utils/Api.js'

const api = new Api()
const base = new Base()

Page({

  data: {
    // 登陆按钮状态
    loginState: false,
    // 用户信息
    userInfo: null,
  },


  onLoad: function (op) {
    this._login()
    // 进入我的页
  },

  // 判断是否有登陆状态
  // _loginState() {
  //   let userInfo = wx.getStorageSync('userInfo')
  //   console.log('Info', userInfo)
  //   if (userInfo) { this.setData({ loginState: true, userInfo: userInfo }) }
  // },

  // 登陆
  _login() {
    base.login(back => {
      this.setData({ loginState: true, userInfo: wx.getStorageSync('userInfo') })
    })
  },

  // 我的话题
  go_huati() {
    let loginState = this.data.loginState
    if (loginState) {
      wx.navigateTo({ url: '/pages/wode/huati' })
    } else {
      this._login()
    }
  },

  // 我的收藏
  go_shoucang() {
    // 跳转到收藏页 -> 获取收藏缓存数组(里面是餐厅ID) -> 查询数据库
    wx.navigateTo({ url: '/pages/wode/shoucang' })
  },

  // 我的留言
  go_liuyan() {
    let loginState = this.data.loginState
    if (loginState) {
      // 跳转到留言页 ->  查询数据库
      wx.navigateTo({ url: '/pages/wode/liuyan' })
    } else {
      this._login()
    }
  },

  // 关于我
  go_guanyuwo() {
    wx.navigateTo({ url: '/pages/wode/guanyuwo' })
  }
})