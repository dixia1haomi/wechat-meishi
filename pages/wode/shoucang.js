import { Api } from '../../utils/Api.js'

const api = new Api()

Page({

  data: {
    Res: {},
    // 是否有收藏,默认没有显示默认页
    is_Shoucang: false,
  },


  onLoad: function (op) {
    this._load()
  },


  // 请求数据
  _load() {
    // 跳转到收藏页 -> 获取收藏缓存数组(里面是餐厅ID) -> 查询数据库
    let shoucanglist = wx.getStorageSync('shoucang') || []
    // 如果有收藏则请求数据，否则显示默认页
    if (shoucanglist.length != 0) {
      // 转成字符串 （服务器只接受字符串shoucanglist.toString()）
      api.shoucanglistCanting({ list: shoucanglist.toString() }, res => {
        console.log('aa', res)
        this.setData({ Res: res, is_Shoucang: true })
      })
    }
  },

  // 取消收藏
  quxiaoshoucang(e) {
    let shoucang = wx.getStorageSync('shoucang')
    let canting_id = e.currentTarget.id
    let res = this.data.Res

    // 删除对应缓存
    for (let i in shoucang) {
      if (shoucang[i] == canting_id) {
        shoucang.splice(i, 1)
        break
      }
    }
    // 删除对应数据
    for (let j in res) {
      if (res[j].id == canting_id) {
        res.splice(j, 1)
        break
      }
    }
    this.setData({ Res: res })
    wx.setStorageSync('shoucang', shoucang)
  },

})