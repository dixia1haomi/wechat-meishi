import { Api } from '../../utils/Api.js'
import { Card } from '../../utils/Card.js'
const api = new Api()
const card = new Card()

Page({

  data: {
    kajuanRes: {}
  },


  onLoad: function (op) {
    this._load(op.id)
  },


  _load(card_id) {
    // 根据卡劵表ID取数据，再根据餐厅ID取文章数据
    api.findKajuan({ card_id: card_id }, res => {
      console.log('根据卡劵表ID取数据', res)
      // 卡劵数据
      this.setData({ kajuanRes: res })
    })
  },

  // 点击头图去餐厅详情页
  go_Canting_Detail(e) {
    let canting_id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/canting/detail?id=' + canting_id,
    })
  },

  // ---------------------- 领取卡劵 ------------------------
  // 接受卡劵ID=字符串，卡劵在数据库中表ID=用于更新库存,callback更新后的数据库数据(服务器update返回的)
  lingqu(e) {
    let card_id = e.currentTarget.dataset.card_id
    let id = e.currentTarget.dataset.id

    // 查看utils/Card类
    card.lingquKajuan(card_id, id, res => {
      // 更新Data的库存数据
      this.setData({ 'kajuanRes.shengyushuliang': res.shengyushuliang })
    })
  },

})