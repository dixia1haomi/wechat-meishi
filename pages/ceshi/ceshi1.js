var amapFile = require('../../gaodemap/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: '1fafc5e0acc166803d566256e8843740' });

Page({


  data: {
    fenxiangState: true,
    // fenxiang
    fenxiang: true,
    // 蒙层
    mask: false
  },

  onLoad: function (op) {
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var longitude = res.longitude
        var latitude = res.latitude
        var speed = res.speed
        var accuracy = res.accuracy
        console.log(res)
      }
    })

  },

  xuanzedizhi() {
    wx.chooseLocation({
      success: (res) => {
        console.log('选择地址', res)
        wx.request({
          url: 'https://restapi.amap.com/v3/distance',
          method: 'GET',
          data: {
            key: 'feebad36bbeda0cc33e794abc5d4421e',
            // 起始
            destination: '103.82183,25.60167',
            // 目的地，经纬度小数点不超过6位
            origins: res.longitude + ',' + res.latitude
          },
          success: (res) => {
            console.log('aa', res)
            console.log('距离/米', res.data.results[0].distance)
            console.log('时间/秒', res.data.results[0].duration)
          }
        })
      }
    })
  },



  onPageScroll: function (e) {
    // 只有最上最下显示
    // console.log(e.scrollTop)

    // 最上显示
    if (e.scrollTop == 0) {
      this.setData({ fenxiangState: true })
    } else {
      // 如果是false了不再重复setData
      if (this.data.fenxiangState) {
        this.setData({ fenxiangState: false })
      }
    }
  },

  // 上拉触底
  onReachBottom: function () {
    console.log('上拉触底')
    this.setData({ fenxiangState: true })
  },

  fenxiang() {
    console.log('fenxiang')
    // 显示蒙层
    this.setData({ mask: !this.data.mask })
  },

  go() {
    console.log('gogogo...')
  },

  // 转发
  zhuanfa() {
    console.log('转发...')
  },
  // 生成
  shengcheng() {
    console.log('生成...')

  },


})

let scroll = 0;


