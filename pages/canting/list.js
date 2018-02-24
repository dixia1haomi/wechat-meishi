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
    loading: true

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
      this.setData({ Res: res, loading: false })
    })
  },

  // 获取首页参数并请求数据 *（*餐厅list数据不应该关联文章，速度更快）
  // _load() {

  //   //-------------去上一页的list数据---------------
  //   let Pages = getCurrentPages()
  //   let page = Pages[Pages.length - 2]  // 上一页
  //   q_Res = page.data.listRes           // 赋到全局变量

  //   // --- 取10条数据(因为swiper的渲染效率所以只取10条) ---
  //   let Res = []
  //   for (let i = 0; i < 10 && i < q_Res.length; i++) { Res.push(q_Res[i]) }
  //   console.log('list_Load', Res)
  //   this.setData({ Res: Res, ResLength: q_Res.length, loading:false })   // 直接显示所有数据的长度
  // },

  // // swiper滑动条件加载数据
  // swiperLoading() {
  //   let Res = this.data.Res           // Res
  //   let length = Res.length           // Res长度
  //   let q_Reslength = q_Res.length    // 总长度
  //   let current = this.data.current   // 卡片当前量
  //   // console.log('current', current, 'length', length, 'q_Reslength', q_Reslength, 'Res', Res)
  //   // res长度小于总长度,才push数据
  //   if (length < q_Reslength) {
  //     // 卡片翻到res的倒数第3张，push数据进res
  //     if (current == length - 2) {
  //       for (let i = length; i < length + 10 && i < q_Reslength; i++) {
  //         Res.push(q_Res[i])
  //       }
  //       console.log('swiperLoading', Res)
  //       // setTimeout(() => {
  //       this.setData({ Res: Res })
  //       // }, 100)
  //     }
  //   }
  // },



  // 筛选页调用where请求(接受筛选页的筛选参数)
  fromShaixuan(shaixuanParams) {
    api.listCanting(shaixuanParams, res => {
      console.log('fromShaixuan', res)
      // q_Res = res  // 覆盖全局q_Res
      // --- 取10条数据(因为swiper的渲染效率所以只取10条) ---
      // let Res = []
      // for (let i = 0; i < 10 && i < q_Res.length; i++) { Res.push(q_Res[i]) }
      // console.log('fromShaixuan_push', Res)
      this.setData({ Res: res, current: 1 })   // 直接显示所有数据的长度
    })
  },



  // swiper滑动事件
  swiperChange(e) {
    console.log('swiperChange', e.detail.current)
    this.setData({ current: e.detail.current + 1 }, () => {
      //   // this.swiperLoading()    // swiper滑动条件加载数据
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

  // 下拉刷新
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    api.listCanting({}, res => {
      console.log('下拉刷新获取餐厅列表', res)
      this.setData({ Res: res })
      // 成功后停止刷新
      wx.stopPullDownRefresh()
    })
  }

})

