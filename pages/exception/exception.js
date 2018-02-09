
Page({

  data: {
    msg: '出现了未知的错误，sorry..'
  },


  onLoad: function (op) {
    // 数据库查询失败    10002
    // 微信             10003
    // Token            10004
    // 服务器未知错误    999

    console.log('exception',op.code)
    this._load(op.code)
  },

  _load(code) {
    if (code == 10002) { this.setData({ msg: '可能查询的数据不存在，错误码：10002' }) }
    if (code == 10003) { this.setData({ msg: '出现了点问题，错误码：10003' }) }
    if (code == 10004) { this.setData({ msg: '出现了点问题，错误码：10004' }) }
    if (code == 999) { this.setData({ msg: '出现了点问题，错误码：999' }) }
    if (code == 'fail') { this.setData({ msg: '请检查你的网络.' }) }
    if (code == 'token') { this.setData({ msg: '获取Token失败.' }) }
  },

  // 返回上一页
  back() { wx.navigateBack({ delta: 1 }) },

})