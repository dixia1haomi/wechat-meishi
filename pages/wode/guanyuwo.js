// pages/wode/guanyuwo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  img() {
    // wx.getImageInfo({
    //   src: '/img/huati2.png',
    //   success: function (res) {
    //     console.log('getimg', res)

    wx.previewImage({
      // current: res.path, // 当前显示图片的http链接
      urls: ['https://mmbiz.qpic.cn/mmbiz_jpg/7nqejTwzfIdQ4cKD9FSgcbFYxD2WMb1k7Wy50QQliarMMkAvNyHibSGkKkhvzy53kiaSoS1HkQEPPZepDlhELqnBg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1'], // 需要预览的图片http链接列表
      success: (res) => {
        console.log('succ', res)
      },
      fail: (err) => {
        console.log('fail', err)
      }
    })
    //   }
    // })

  },

  // 允许从相机和相册扫码
  aaa() {
    wx.scanCode({
      success: (res) => {
        console.log('aaa',res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})