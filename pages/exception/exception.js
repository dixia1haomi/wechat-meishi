
Page({

  data: {
    code: ''
  },


  onLoad: function (op) {
    // 数据库查询失败           20000
    // 服务器错误statusCode     500
    op.code && this.setData({ code: op.code })

  },

  // 返回上一页
  back() { wx.navigateBack({ delta: 1 }) },

})