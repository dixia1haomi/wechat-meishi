import { Base } from '../../utils/Base.js'
import { Api } from '../../utils/Api.js'

const api = new Api()
const base = new Base()

Page({

  data: {
    // 登陆按钮状态
    loginState: false,
  },


  onLoad: function (op) {
    this._loginState()
  },

  // 判断是否有登陆状态
  _loginState() {
    let userInfo = wx.getStorageSync('userInfo')
    console.log('Info', userInfo)
    if (userInfo) { this.setData({ loginState: true, userInfo: userInfo }) }
  },

  // 登陆
  login() {
    base.authorize_userinfo(res => {
      console.log('auth', res)
      if (res) {
        wx.getUserInfo({
          withCredentials: false,
          success: (res) => {
            console.log('success', res)
            api.userLogin(res.userInfo, (res) => {
              console.log('登陆数据写入成功', res)
              // 登陆成功 -》 设置缓存
              wx.setStorageSync('userInfo', res)
              // 登陆状态处理
              this._loginState()
            })
          }
        })
      }
    })
  },

  // 我的话题
  go_huati() {
    let loginState = this.data.loginState
    if (loginState) {
      wx.navigateTo({ url: '/pages/wode/huati' })
    } else {
      this.login()
    }
  },

  // 我的收藏
  go_shoucang() {
    // 跳转到收藏页 -> 获取收藏缓存数组(里面是餐厅ID) -> 查询数据库
    wx.navigateTo({ url: '/pages/wode/shoucang' })
  },
})