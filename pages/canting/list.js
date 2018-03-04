import { Api } from '../../utils/Api.js'
// import { Config } from '../../utils/Config.js'

const api = new Api()
// const app = getApp()

// let q_Res;

Page({

  data: {


    // Res
    Res: [],
    // 当前页
    current: 1,
    // 筛选页选择的参数
    shaixuanParams: {},
    // 加载中.
    loading: true,
    // 所有数据
    ResAll: []

  },

  onLoad: function (op) {
    // 请求餐厅列表
    this._load()
  },

  onShow: function () {
    // 请求餐厅列表
    // this._load()
  },


  // 请求餐厅列表
  _load() {
    api.listCanting({}, res => {
      console.log('餐厅列表', res)
      let Res = []

      // 根据swiper滑动current加载数据以渲染效率,每次push5条
      for (let i = 0; i < 2 && i < res.length; i++) { Res.push(res[i]) }
      this.setData({ Res: Res, loading: false }, () => {
          this.setData({ Res: res })
      })
    })
  },

  // swiper滑动事件
  swiperChange(e) {
    console.log('swiperChange', e.detail.current)
    // current从0开始，改成从1开始
    let current = e.detail.current + 1
    this.setData({ current: current })
  },


  // 筛选页调用where请求(接受筛选页的筛选参数)
  fromShaixuan(shaixuanParams) {
    api.listCanting(shaixuanParams, res => {
      console.log('fromShaixuan', res)
      // --- 后期添加筛选应考虑swiper的渲染效率 ---
      this.setData({ Res: res, current: 1 })   // 直接显示所有数据的长度
    })
  },





  // GO餐厅详情
  go_Detail(e) {
    let id = e.currentTarget.id
    wx.navigateTo({ url: '/pages/canting/detail?id=' + id })
  },


  // 列表展示
  // showListTap() {
  //   this.setData({ showList: !this.data.showList })
  // },

  // 筛选更多
  go_Shaixuan() { wx.navigateTo({ url: '/pages/canting/shaixuan' }) },


  // // ------------------------------------------------------------------------------------
  // // 上拉触底
  // onReachBottom: function () {

  //   let Res = this.data.Res           // Res
  //   let length = Res.length           // Res的长度
  //   let q_Reslength = q_Res.length    // 总长度
  //   // console.log('length', Reslength, 'ResStlength', ResStlength)
  //   // // 当前长度小于总长度就push数据
  //   if (length < q_Reslength) {
  //     for (let i = length; i < length + 10 && i < q_Reslength; i++) {
  //       Res.push(q_Res[i])
  //     }
  //     console.log('上拉触底', Res)
  //     this.setData({ Res: Res })
  //   } else {
  //     console.log('没有更多了')
  //   }
  // },



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

