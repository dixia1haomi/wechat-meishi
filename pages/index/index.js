import { Api } from '../../utils/Api.js'
const api = new Api()

// import { Base } from '../../utils/Base.js'
// import { Config } from '../../utils/Config.js'
// const base = new Base()


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

  // 获取今日推荐
  _load() {

    // ------ 取所有List数据，餐厅List要用------
    api.listCanting({}, res => {
      console.log('a', res)
      this._for_List(res)                            // 遍历餐厅list获取推荐数据并设置Res
      this.setData({ listRes: res, loading: false })
    })

  },

  // 遍历餐厅list获取推荐数据并设置Res
  _for_List(list) {
    let res;
    for (let i in list) {
      if (list[i].top == 1) {
        res = list[i]
        break
      }
    }
    this.setData({ Res: res })
  },



  // ----------------------

  go_ceshi() {
    wx.navigateTo({ url: '/pages/ceshi/ceshi3' })
  },

  // --------------------


  // 查看餐厅列表
  go() {
    wx.navigateTo({ url: '/pages/canting/list' })
  },

  // 今日推荐
  topTap() { wx.navigateTo({ url: '/pages/canting/detail?id=' + this.data.Res.id }) },



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
