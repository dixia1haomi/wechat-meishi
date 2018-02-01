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
    console.log(e.scrollTop)

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


  // data: {
  //   width: '',
  //   height: ''
  // },

  // onLoad: function (options) {
  //   const ctx = wx.createCanvasContext('myCanvas')

  //   // 获取设备信息
  //   wx.getSystemInfo({
  //     success: (res) => {
  //       console.log(res.windowWidth)
  //       this.setData({ width: res.windowWidth })
  //       console.log(res.windowHeight)
  //       this.setData({ height: res.windowHeight })
  //     }
  //   })


  //   wx.getImageInfo({
  //     src: '/img/guo.jpg',
  //     success: (res) => {
  //       console.log('0', res)
  //       console.log('1', res.width)
  //       console.log('2', res.height)
  //       console.log('3', res.path)

  //       // 第一张图(前4个参数是图片参数，后4个是画布参数)
  //       // 按照宽高比算出调整后图片的高度 = (屏幕宽 * 图片高) / 图片宽;
  //       let canvHeight = (this.data.width * res.height) / res.width
  //       console.log('1图绘制后高', canvHeight)
  //       ctx.drawImage('/img/guo.jpg', 0, 0, res.width, res.height, 0, 0, this.data.width, canvHeight)
  //       ctx.setFontSize(30)
  //       ctx.fillText('Hello', 0, 30)
  //       ctx.fillText('阿西', 100, 100)

  //       // 第二张图
  //       wx.getImageInfo({
  //         src: '/img/2.png',
  //         success: (res2) => {
  //           console.log('res2-w', res2.width)
  //           console.log('res2-h', res2.height)

  //           // 按照宽高比算出调整后图片的高度 = (屏幕宽 * 图片高) / 图片宽;
  //           let canvHeight2 = (this.data.width * res2.height) / res2.width
  //           console.log('2图绘制后高', canvHeight2)
  //           // 第二张图(根据第一图的高开始绘制)
  //           ctx.drawImage('/img/2.png', 0, 0, res2.width, res2.height, 0, canvHeight, this.data.width, canvHeight2)

  //           ctx.draw('', (res) => {
  //             console.log('1111111')
  //             // wx.canvasToTempFilePath({ })
  //           })

  //         }
  //       })

  //     }
  //   })