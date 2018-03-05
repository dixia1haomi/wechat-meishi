
Page({

  data: {
    msg: '出现了未知的错误，sorry..'
  },


  onLoad: function (op) {
    console.log('exception', op.code)
    this._load(op.code)
  },

  _load(code) {
    if (code == 'basefail') { this.setData({ msg: '网络状态不佳,请重试.' }) }
    if (code == 'statusCode不等于200') { this.setData({ msg: '出现了点问题,200' }) }
    if (code == 'errorCode不等于0') { this.setData({ msg: '出现了点问题,0' }) }
  },

  // 返回上一页
  back() { wx.navigateBack({ delta: 1 }) },

})