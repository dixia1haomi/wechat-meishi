import { Api } from '../../utils/Api.js'
import { Base } from '../../utils/Base.js'

const api = new Api()
const base = new Base()

Page({
  data: {
    cantinglistRes: {},
  },

  onLoad: function () {
    this._load()
    this.asd()
  },

  _load() {
    api.listCanting({}, res => { this.setData({ cantinglistRes: res }) })
  },

  // 跳转查看餐厅
  detailcanting(e) {
    let id = e.currentTarget.id
    wx.navigateTo({ url: '/pages/canting/detail?id=' + id })
  },

  // 查询用户关联的星评表，转成数组存入缓存
  asd() {
    api.userXingping({}, res => {
      console.log(res)
      // 判断用户有没有星评数据
      if (res.xingping) {
        let list = res.xingping.canting_list
        console.log(JSON.parse(list))
        wx.setStorageSync('xingpinglist', JSON.parse(list))
      } else {
        console.log('meiyouxingping')
        wx.setStorageSync('xingpinglist', [])
      }
    })
  },

  login() {
    base.authorize_userinfo(res => {
      console.log('auth', res)
      if (res) {
        wx.getUserInfo({
          withCredentials: false,
          success: (res) => {
            console.log('success', res)
            api.userLogin(res.userInfo, (res) => {
              console.log('login', res)
              // 登陆成功 -》 设置缓存
              wx.setStorageSync('userInfo', res)
            })
          }
        })
      }
    })
  }

})
