import { Api } from '../../utils/Api.js'
import { Card } from '../../utils/Card.js'
import { Base } from '../../utils/Base.js'
const base = new Base()
const api = new Api()
const card = new Card()
const app = getApp()

Page({

  data: {
    kajuanRes: {},
    loading: true,

    // 分享按钮状态
    // fenxiangState: false,
    // 分享蒙层
    mask: false,
    // 背景模糊
    blur: false,
    // 画布状态
    canvas: false,
    // 成生海报用的屏幕宽高
    width: '',
    height: '',
    // 屏幕总高（连最上面）
    screenHeight: '',
  },


  onLoad: function (op) {
    this._load(op.id)
    // 获取屏幕宽高
    this.setData({ width: app.appData.sysWidth, height: app.appData.sysHeight, screenHeight: app.appData.screenHeight })
  },


  _load(card_id) {
    // 根据卡劵表ID取数据，再根据餐厅ID取文章数据
    api.findKajuan({ card_id: card_id }, res => {
      console.log('根据卡劵表ID取数据', res)
      // 卡劵数据
      this.setData({ kajuanRes: res, loading: false })
    })
  },

  // 点击头图去餐厅详情页
  go_Canting_Detail(e) {
    let canting_id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/canting/detail?id=' + canting_id,
    })
  },

  // ---------------------- 领取卡劵 ------------------------
  // 接受卡劵ID=字符串，卡劵在数据库中表ID=用于更新库存,callback更新后的数据库数据(服务器update返回的)
  lingqu(e) {
    if (getApp().appData.LoginState) {
      // 已有用户信息
      let card_id = e.currentTarget.dataset.card_id
      let id = e.currentTarget.dataset.id
      // 查看utils/Card类
      card.lingquKajuan(card_id, id, res => {
        // 更新Data的库存数据
        this.setData({ 'kajuanRes.shengyushuliang': res.shengyushuliang })
      })
    } else {
      // 调用base用户授权
      base.login(back => { this.lingqu(e) })
    }
  },


  // 点击分享按钮显示蒙层
  fenxiang() {
    console.log('fenxiang')
    // 显示蒙层
    this.setData({ mask: !this.data.mask, blur: !this.data.blur })
  },



  // ----------------------------------------------- 生成海报 -------------------------------------------------------
  shengcheng() {
    console.log('生成...')
    // 打开蒙层
    this.setData({ canvas: true })
    wx.showLoading({ title: '生成中...' })
    // 创建canvas
    const ctx = wx.createCanvasContext('myCanvas')
    // 绘图(1图 1:1(720*720), 2图 10:6(720*432) ,底边还有一点点)
    wx.getImageInfo({
      // src: 'https://mmbiz.qpic.cn/mmbiz_jpg/7nqejTwzfIeVwUQcu7ic4FVibfHWUyG5deck6Uyw49ia3PPAUXztWQHyhOMpstm90WUHSWyiacRalpzVwia0mNKiaMsQ/0?wx_fmt=jpeg',
      src: this.data.kajuanRes.img,
      success: (res) => {
        console.log('获取图片信息1', res)
        // 第一张图(前4个参数是图片参数，后4个是画布参数)
        // 按照宽高比算出调整后图片的高度 = (屏幕宽 * 图片高) / 图片宽;
        let canvHeight = (app.appData.sysWidth * res.height) / res.width
        console.log('1图绘制后高', canvHeight)
        ctx.drawImage(res.path, 0, 0, res.width, res.height, 0, 0, app.appData.sysWidth, canvHeight)

        // 第二张图
        wx.getImageInfo({
          src: "https://mmbiz.qpic.cn/mmbiz_jpg/7nqejTwzfIeVwUQcu7ic4FVibfHWUyG5deAdPgVeq1XdicHxj9IdxXVaicuCJ4UkgDbFwvs2Vh8Jlfm367t6pxPq7Q/0?wx_fmt=jpeg",
          success: (res2) => {
            console.log('获取图片信息2', res2)
            // 按照宽高比算出调整后图片的高度 = (屏幕宽 * 图片高) / 图片宽;
            let canvHeight2 = (app.appData.sysWidth * res2.height) / res2.width
            console.log('2图绘制后高', canvHeight2)
            // 第二张图(根据第一图的高开始绘制)
            ctx.drawImage(res2.path, 0, 0, res2.width, res2.height, 0, canvHeight, app.appData.sysWidth, canvHeight2)
            // 写字
            ctx.setFontSize(20)
            ctx.setFillStyle('Black') // 黑色
            // XXXX 邀请你领取
            // ctx.setFillStyle('tomato') 
            ctx.fillText('# '+app.appData.userinfo.nick_name + ' 邀您领取', 10, canvHeight + 30)
            // XXXX餐厅XX劵
            ctx.setFontSize(25)
            ctx.setFillStyle('red') // 红色
            ctx.fillText(this.data.kajuanRes.title, 10, canvHeight + 70)
            ctx.setFontSize(20)
            ctx.setFillStyle('Black') // 黑色
            ctx.fillText('剩余' + this.data.kajuanRes.shengyushuliang + '张', 10, canvHeight + 110)
            ctx.fillText('有效期' + this.data.kajuanRes.qixian, 10, canvHeight + 150)
            // ctx.fillText('阿西', 0, 100)
            // 执行绘制
            ctx.draw(false, back => {
              console.log('绘制完成')
              // 保存图片
              console.log('time')
              this.saveImg()
            })
          }
        })
      }
    })
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
        this.setData({ canvas: false, mask: false, blur: false })
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
            if (err.errMsg != 'saveImageToPhotosAlbum:fail cancel') {
            console.log('未授权保存到系统相册')
            base.authorize_writePhotosAlbum(back => {
              console.log('c', back)
              // 已授权，重新调用保存到系统相册
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

            })
            }
          }
        })
      }
    })
  },

})