import { Base } from '../../utils/Base.js'

const base = new Base()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: '',
    height: '',

    canvas: false,
    cover: false

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('kuang', app.appData.sysWidth)
    console.log('gao', app.appData.sysHeight)
    this._load()
  },

  // 去全局变量设备高宽
  _load() {
    this.setData({ width: app.appData.sysWidth, height: app.appData.sysHeight })
  },

  // 保存图片
  saveImg() {
    // 保存图片并返回路径
    wx.canvasToTempFilePath({
      // x: 0,           // 画布x轴起点（默认0）
      // y: 0,           // 画布y轴起点（默认0）
      // width: this.data.width,      // 画布宽度（默认为canvas宽度-x）
      // height: this.data.height,     // 画布宽度（默认为canvas宽度-x）
      destWidth: app.appData.sysWidth * 5, // 输出图片宽度（默认为width）
      destHeight: app.appData.sysHeight * 5,// 输出图片高度（默认为Height）
      canvasId: 'myCanvas', // 标识，组件ID
      success: (res) => {
        console.log('保存图片返回路径', res.tempFilePath)
        // 影藏蒙层，画布，提示
        this.setData({ canvas: false })
        wx.hideLoading()
        // 保存到系统相册
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: (res) => {
            console.log('保存成功', res)
            wx.showModal({
              title: '海报已保存到系统相册',
              content: '快去分享给朋友,叫伙伴们来围观吧',
              showCancel: false,       // 不显示取消按钮
              confirmText: '我知道了'   // 确定按钮文字（4个）
            })
          },
          fail: (err) => {
            console.log('保存失败', err)
            // 可能有没授权（*引导授权）
            if (err.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
              console.log('未授权保存到系统相册')
              base.authorize_writePhotosAlbum(back => {
                console.log('c', back)
                // 已授权
                if (back) {
                  // 重新调用保存到系统相册
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: (res) => {
                      console.log('保存成功', res)
                      wx.showModal({
                        title: '海报已保存到系统相册',
                        content: '快去分享给朋友,叫伙伴们来围观吧',
                        showCancel: false,       // 不显示取消按钮
                        confirmText: '我知道了'   // 确定按钮文字（4个）
                      })
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
  },

  // 生成海报
  shengcheng() {
    // 打开蒙层
    this.setData({ canvas: true })
    wx.showLoading({ title: '生成中...' })
    // 创建canvas
    const ctx = wx.createCanvasContext('myCanvas')
    // 绘图(1图 1:1(720*720), 2图 10:6(720*432) ,底边还有一点点)
    wx.getImageInfo({
      src: '/img/guo.jpg',
      success: (res) => {
        console.log('获取图片信息1', res)
        // 第一张图(前4个参数是图片参数，后4个是画布参数)
        // 按照宽高比算出调整后图片的高度 = (屏幕宽 * 图片高) / 图片宽;
        let canvHeight = (app.appData.sysWidth * res.height) / res.width
        console.log('1图绘制后高', canvHeight)
        ctx.drawImage('/img/guo.jpg', 0, 0, res.width, res.height, 0, 0, app.appData.sysWidth, canvHeight)
        ctx.setFontSize(30)
        ctx.fillText('Hello', 0, 30)
        ctx.fillText('阿西', 100, 100)

        // 第二张图
        wx.getImageInfo({
          src: '/img/2.png',
          success: (res2) => {
            console.log('获取图片信息2', res2)
            // 按照宽高比算出调整后图片的高度 = (屏幕宽 * 图片高) / 图片宽;
            let canvHeight2 = (app.appData.sysWidth * res2.height) / res2.width
            console.log('2图绘制后高', canvHeight2)
            // 第二张图(根据第一图的高开始绘制)
            ctx.drawImage('/img/2.png', 0, 0, res2.width, res2.height, 0, canvHeight, app.appData.sysWidth, canvHeight2)
            // 执行绘制
            ctx.draw(false, back => {
              console.log('绘制完成')
              // 保存图片
              // setTimeout((time) => {
              console.log('time')
              this.saveImg()
              // }, 500)
            })
          }
        })
      }
    })
  },

})
