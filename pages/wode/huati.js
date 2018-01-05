import { Api } from '../../utils/Api.js'

const api = new Api()

Page({

  data: {
    Res: {},
  },


  onLoad: function (op) {
    this._load()
  },

  // 我的话题
  _load() {
    api.userHuati({}, res => {
      console.log('我的话题', res)
      this.setData({ Res: res })
    })
  },

})