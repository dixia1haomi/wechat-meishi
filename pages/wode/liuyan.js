import { Api } from '../../utils/Api.js'

const api = new Api()

let page = 1

Page({

  data: {
    Res: {},
    // 总条数
    count: 0,
    // 没有留言
    noLiuyanState: false,
    // 分页加载没有更多了
    noData:false
  },


  onLoad: function (op) {
    this._load()
  },

  // 我的留言
  _load() {
    api.myLiuyan({ page: 1 }, res => {
      console.log('我的留言', res)
      // 如果没有留过言,返回errorCode 20000,显示没有留言.
      if (res.errorCode) {
        this.setData({ noLiuyanState: true })
      } else {
        this.setData({ Res: res.data, count: res.count })
      }
    })
  },

  // 上拉触底
  onReachBottom: function () {
    console.log('上拉触底')
    let count = this.data.count
    let length = this.data.Res.length

    if (length >= count) {
      console.log('没有更多了')
      this.setData({ noData: true })
    } else {
      api.myLiuyan({ page: ++page }, res => {
        console.log('我的留言', res)
        this.setData({ Res: this.data.Res.concat(res.data) })
      })
    }

    // 如果全部数据都取出来了，显示没有更多了，否则请求下一页数据（每页20条）
    // if (resLength == count) {
    //   console.log('没有更多了')
    //   // this.setData({ noData: true })
    // } else {
    //   api.listLiuyan({ canting_id: id, page: ++page }, res => {
    //     console.log('liuyan上拉触底', res, page)
    //     this.setData({ Res: this.data.Res.concat(res.data) })
    //   })
    // }
  },

  // 页面卸载
  onUnload: function () {
    page = 1
    console.log('xiezai', page)
  },


  // 删除留言（*暂不支持,）


  // 返回
  back() { wx.navigateBack({ delta: 1 }) },

})