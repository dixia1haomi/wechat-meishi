import { Api } from '../../utils/Api.js'

const api = new Api()

let page = 1

Page({

  data: {
    Res: [],
    // 总条数
    count: 0,
    // 没有留言
    // noLiuyanState: false,
    // 分页加载没有更多了
    // noData: false,
    // jiazai.
    loading: true
  },


  onLoad: function (op) {
    // console.log('liuyan', JSON.parse(op.op))
    // setTimeout(() => {
      this._load()
    // }, 3000)
  },

  // 我的留言（分页20条）
  _load() {
    api.myLiuyan({ page: 1 }, res => {
      console.log('我的留言', res)
      this.setData({ Res: res.data, count: res.count, loading: false })
    })
  },

  // 上拉触底
  onReachBottom: function () {
    console.log('上拉触底')
    // let count = this.data.count
    // let length = this.data.Res.length

    // 如果还有数据
    if (this.data.Res.length < this.data.count) {
      // 显示加载
      wx.showNavigationBarLoading()
      // 请求
      api.myLiuyan({ page: ++page }, res => {
        // 隐藏加载
        wx.hideNavigationBarLoading()

        this.setData({ Res: this.data.Res.concat(res.data) })
      })
    }

  },

  // 页面卸载
  onUnload: function () {
    page = 1
    console.log('xiezai', page)
  },

  // 返回
  // back() { wx.navigateBack({ delta: 1 }) },



  // 删除留言（*预留,以后用的时候取消注释）
  deleteLiuyan(e) {
    // 提示确定要删除?
    wx.showModal({
      content: '确认要删除这条留言?',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')

          let id = e.currentTarget.id
          api.deleteLiuyan({ id: id }, res => {
            console.log('删除留言，id=' + id, res)

            // 删除成功后删除Res相应数据刷新显示
            let Res = this.data.Res
            for (let i in Res) {
              if (Res[i].id == id) {
                Res.splice(i, 1)
              }
            }
            this.setData({ Res: Res })
          })
        }
      }
    })
  },


  // --------------------------------------------------------------------------------------------------------------
  // 根据canting_id转到餐厅详情页
  go_Canting(e) {
    let id = e.currentTarget.id
    wx.navigateTo({ url: '/pages/canting/detail?id=' + id })
  },

})