import { Api } from '../../utils/Api.js'

const api = new Api()

Page({

  data: {
    Res: {},
    // 显示参与话题的Form页
    showForm: false,
  },

  onLoad: function (op) {
    this._load(op.id)

  },

  // 查询话题详情
  _load(id) {
    api.detailHuati({ id: id }, res => {
      console.log('查询话题详情', res)
      this._time(res)
      this.setData({ Res: res })
    })
  },
  // 处理日期时间格式(substring截取服务器返回的日期时间字符串)
  _time(res) {
    // 处理话题
    res.create_time = res.create_time.substring(0, 10)
    // 处理user话题
    let userhuati = res.userhuati
    for (let i in userhuati) {
      userhuati[i].create_time = userhuati[i].create_time.substring(5, 10)
    }
  },

  // 参与话题showForm
  createHuati() { this.setData({ showForm: true }) },

  // 提交
  tijiao() {
    console.log('//可以正常使用,还差拼接餐厅明和上传图片')
    // let huati_id = this.data.Res.id
    // let neirong = this.data.neirong
    // // 接受话题ID，内容，（接口内部获取uid）
    // api.createUserHuati({ huati_id: huati_id, neirong: neirong }, res => {
    //   console.log('参与话题', res)
    //   wx.showModal({ title: '参与话题成功' })
    //   this.setData({ showForm: false })
    // })
  },

  // 内容input事件
  neirongInput(e) {
    console.log(e)
    this.setData({ neirong: e.detail.value })
  },

})