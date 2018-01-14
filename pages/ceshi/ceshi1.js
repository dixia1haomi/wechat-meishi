var amapFile = require('../../gaodemap/amap-wx.js');
var myAmapFun = new amapFile.AMapWX({ key: '1fafc5e0acc166803d566256e8843740' });

Page({


  data: {

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

        // wx.request({
        //   url: 'https://restapi.amap.com/v3/distance',
        //   method: 'GET',
        //   data: {
        //     key: 'feebad36bbeda0cc33e794abc5d4421e',
        //     // 起始
        //     destination: '103.82183,25.60167',
        //     // 目的地，经纬度小数点不超过6位
        //     origins: '103.8121, 25.576'
        //   },
        //   success: (res) => {
        //     console.log('aa', res)
        //     console.log('距离/米', res.data.results[0].distance)
        //     console.log('时间/秒', res.data.results[0].duration)
        //   }
        // })
      }
    })

    // wx.request({
    //   url: 'https://restapi.amap.com/v3/distance',
    //   method: 'GET',
    //   data: {
    //     key: 'feebad36bbeda0cc33e794abc5d4421e',
    //     // 起始
    //     destination: '114.465302,40.004717',
    //     // 目的地
    //     origins: '116.481028,39.989643|114.481028,39.989643|115.481028,39.989643'
    //   },
    //   success: (res) => {
    //     console.log('aa', res)
    //   }
    // })

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

})