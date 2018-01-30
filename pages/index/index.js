import { Api } from '../../utils/Api.js'
import { Base } from '../../utils/Base.js'
import { Config } from '../../utils/Config.js'

const api = new Api()
const base = new Base()
const app = getApp()

Page({
  data: {
    // 区域组件
    quyuState: false,
    quyuId: 0,
    quyuList: Config.quyu,

    // 菜系组件
    caixiState: false,
    caixiId: 0,
    caixiList: Config.caixi,

    // 正在请求页
    loading: false
  },

  onLoad: function () {
    this._load()
  },

  onShow: function () {
  },

  // 获取今日推荐
  _load() {
    // base.authorize_userLocation(res => {
    //   console.log('bb', res)
    //   console.log('appData', app.appData)
    // })

    // base.zuobiao(res => {
    //   console.log('index-app', app.appData)
    // })
    // console.log('aasd',app.appData.userLocation)


    // ------ 取所有List数据，餐厅List要用------
    api.listCanting({}, res => {
      console.log('a', res)
      this._for_List(res)                            // 遍历餐厅list获取推荐数据并设置Res
      this.setData({ listRes: res, loading: true })
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



  // // 区域组件sheetDown
  // quyuSheetTap() { this.setData({ quyuState: true }) },
  // quyuitemE(e) { this.setData({ quyuId: e.detail.item.id }) },

  // // 菜系组件sheetDown
  // caixiSheetTap() { this.setData({ caixiState: true }) },
  // caixiitemE(e) { this.setData({ caixiId: e.detail.item.id }) },


  // 查看餐厅列表
  go() {
    // 获取参数
    // let quyu = this.data.quyuId
    // let caixi = this.data.caixiId
    // 携带参数去餐厅列表
    // wx.navigateTo({ url: '/pages/canting/list?quyu=' + quyu + '&caixi=' + caixi })
    wx.navigateTo({ url: '/pages/canting/list' })
  },

  // 今日推荐
  topTap() { wx.navigateTo({ url: '/pages/canting/detail?id=' + this.data.Res.id }) },



  // -----------------------------------------------------------------------------------------




})
