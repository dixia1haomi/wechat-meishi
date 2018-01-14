import { Api } from '../../utils/Api.js'
const api = new Api()

let canting_id;
Page({

  data: {

  },


  onLoad: function (op) {
    console.log(op.id)
    canting_id = op.id
  },

  _load(id) {
  },

  // liuyanInput
  liuyanInput(e) {
    console.log('input', e.detail.value)
    this.setData({ liuyanInput: e.detail.value })
  },

  // 提交
  tijiao_liuyan() {
    let neirong = this.data.liuyanInput   // 留言内容

    // 获取留言内容，餐厅ID，（uid服务器内部获取）
    // api.createLiuyan({ canting_id: canting_id, neirong: neirong }, res => {
    //   console.log('create', res)
    // if(xxx){
    // 留言成功
    // }else{
    // 留言失败
    // }

    // ----- 测试返回上一页更新留言数据 ----
    let Pages = getCurrentPages()
    let detailPage = Pages[Pages.length - 2]    // 上一页
    detailPage.create_liuyan(neirong, res => {
      console.log('liuyan-ye',res)
      wx.navigateBack({ delta: 1 })
    })
    // })
  },

})