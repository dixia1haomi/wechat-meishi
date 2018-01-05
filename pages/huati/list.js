import { Api } from '../../utils/Api.js'

const api = new Api()

Page({

  data: {
    Res: {},
  },


  onLoad: function (op) {
    this._load()
  },

  // 查询话题列表
  _load() {
    api.listHuati({}, res => {
      console.log('话题列表', res)
      this.setData({ Res: res })
    })
  },

  // go_Detail
  go_Detail(e) {
    let huati_id = e.currentTarget.id
    wx.navigateTo({ url: '/pages/huati/detail?id=' + huati_id })
  },

})