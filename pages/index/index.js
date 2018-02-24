import { Api } from '../../utils/Api.js'
import { Base } from '../../utils/Base.js'
const api = new Api()
const app = getApp()

Page({
  data: {

    // 正在请求页
    loading: true
  },

  onLoad: function () {
    this._load()
  },

  onShow: function () {
  },


  _load() {
    // 获取推荐餐厅

    this._getCanting_Top()

    // 获取卡劵列表
    this._kajuan_List()
  },


  // 获取推荐餐厅
  _getCanting_Top() {
    api.listCanting({ top: 1 }, res => {
      console.log('获取推荐餐厅', res)
      this.setData({ Res: res, loading: false })
    })
  },

  // 获取卡劵列表
  _kajuan_List() {
    api.selectKajuan({}, res => {
      console.log('卡劵列表', res)
      this.setData({ kajuanRes: res, loading: false })
    })
  },


  // 查看餐厅列表
  _go_canting_list() {
    wx.switchTab({ url: '/pages/canting/list' })
  },

  // 查看卡劵详情
  _go_kajuan_detail(e) {
    // let card_id = e.currentTarget.id
    wx.navigateTo({ url: '/pages/kajuan/kajuan?id=' + e.currentTarget.id })
  },

  // 查看餐厅详情
  _go_canting_detail(e) {
    // let canting_id = e.currentTarget.id
    wx.navigateTo({ url: '/pages/canting/detail?id=' + e.currentTarget.id })
  },



  // --------------------------------------- 分享转发 --------------------------------------------------
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '曲靖袋鼠美食+',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        console.log('转发成功', res)
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败', res)
      }
    }
  },



})
