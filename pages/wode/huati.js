import { Api } from '../../utils/Api.js'

const api = new Api()

let page = 1
Page({

  data: {
    Res: [],
    //总条数
    count: 0,
    // 显示没有留过话题
    // noMyHuatiState: false,
    // 分页加载没有更多了
    // noData: false,
    // zaijia.
    loading: true
  },


  onLoad: function (op) {
    // console.log('huati',JSON.parse(op.op))
    this._load()
  },

  // 我的话题
  _load() {
    console.log('huati')
    api.myHuati({ page: 1 }, res => {
      console.log('我的话题', res)

      // 拆解neirong字段成数组新建new_neirong
      for (let i in res.data) { res.data[i].new_neirong = res.data[i].neirong.split('||') }

      this.setData({ Res: res.data, count: res.count, loading: false })
    })
  },


  // 上拉触底
  onReachBottom: function () {
    console.log('上拉触底')

    // 如果还有数据
    if (this.data.Res.length < this.data.count) {
      // 显示加载
      wx.showNavigationBarLoading()
      // 请求
      api.myHuati({ page: ++page }, res => {
        // 隐藏加载
        wx.hideNavigationBarLoading()

        this.setData({ Res: this.data.Res.concat(res.data) })
      })
    }

    // let count = this.data.count
    // let length = this.data.Res.length

    // if (length >= count) {
    //   console.log('没有更多了')
    //   this.setData({ noData: true })
    // } else {
    //   // 显示加载
    //   wx.showNavigationBarLoading()
    //   api.myHuati({ page: ++page }, res => {
    //     console.log('我的留言', res)
    //     // 隐藏加载
    //     wx.hideNavigationBarLoading()
    //     // 拆解neirong字段成数组新建new_neirong
    //     let data = res.data
    //     for (let i in data) { data[i].new_neirong = data[i].neirong.split('||') }

    //     this.setData({ Res: this.data.Res.concat(res.data) })
    //   })
    // }
  },

  // 页面卸载
  onUnload: function () {
    page = 1
    console.log('xiezai', page)
  },

  // 返回
  // back() { wx.navigateBack({ delta: 1 }) },


  // 删除一条我的话题
  deleteMyHuati(e) {
    // 提示确定要删除?
    wx.showModal({
      content: '确认要删除这条话题?',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')

          let id = e.currentTarget.id
          api.deleteMyHuati({ id: id }, res => {
            console.log('删除话题，id=' + id, res)

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


  // ------------------------------------------------------------------------------------------------------------
  // 根据话题ID跳转到话题详情页
  go_Huati(e) {
    let id = e.currentTarget.id
    wx.navigateTo({ url: '/pages/huati/detail?id=' + id })
  },
})