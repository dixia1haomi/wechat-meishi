import { Api } from '../../utils/Api.js'

const api = new Api()

let id;
let page = 1
Page({

  data: {

    Res: {},

    // 留言总数
    count: 0,

    // 没有更多了
    noData: false
  },


  onLoad: function (op) {
    id = op.id  // 全局餐厅ID
    this._load()
  },

  // 获取上一页（餐厅详情页）准备的数据
  _load() {
    // 方案1 - 从上一页实例获取数据
    let Pages = getCurrentPages()
    let page = Pages[Pages.length - 2]  // 上一页
    // liuyanRes中包含data（留言），count（留言总条数）
    this.setData({ Res: page.data.liuyanRes.data, count: page.data.liuyanRes.count })

    // 方案2 - Api请求
    // api.listLiuyan({ canting_id: id, page: 1 }, res => {
    //   console.log('方案2 - Api请求', res)
    //   this.setData({ Res: res.data, count: res.count })
    // })
  },

  // 上拉触底
  onReachBottom: function () {
    console.log('上拉触底')
    let count = this.data.count                // 留言总数
    let resLength = this.data.Res.length       // 当前数据条数

    // 如果全部数据都取出来了，显示没有更多了，否则请求下一页数据（每页20条）
    if (resLength == count) {
      console.log('没有更多了')
      this.setData({ noData: true })
    } else {
      api.listLiuyan({ canting_id: id, page: ++page }, res => {
        console.log('liuyan上拉触底', res, page)
        this.setData({ Res: this.data.Res.concat(res.data) })
      })
    }
  },

  // 页面卸载
  onUnload: function () {
    page = 1
    console.log('xiezai', page)
  },
})