
Page({

  data: {
    code: ''
  },


  onLoad: function (op) {
    // 数据库查询失败
    op.code == 20000 && this.setData({ code: op.code })

  },

  // 返回上一页
  back() { wx.navigateBack({ delta: 1 }) },

})