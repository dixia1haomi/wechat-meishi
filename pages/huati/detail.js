import { Api } from '../../utils/Api.js'

const api = new Api()

Page({

  data: {
    Res: {},
    showForm: false,
  },

  onLoad: function (op) {
    this._load(op.id)
  },

  // 查询话题详情
  _load(id) {
    api.detailHuati({ id: id }, res => {
      console.log('查询话题详情', res)
      this.setData({ Res: res })
    })
  },

  // 参与话题showForm
  createHuati() {
    this.setData({ showForm: true })

  },

  // 提交
  tijiao() {
    let huati_id = this.data.Res.id
    let neirong = this.data.neirong
    // 接受话题ID，内容，（接口内部获取uid）
    api.createUserHuati({ huati_id: huati_id, neirong: neirong }, res => {
      console.log('参与话题', res)
      wx.showModal({ title: '参与话题成功' })
      this.setData({ showForm: false })
    })
  },

  // 内容input事件
  neirongInput(e) {
    console.log(e)
    this.setData({ neirong: e.detail.value })
  },

})